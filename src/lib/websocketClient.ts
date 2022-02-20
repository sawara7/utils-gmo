import {
    getRealTimeDatabase,
    sleep
} from "my-utils"

import {
    gmoPrivateStreamAPIClass as gmoPrivateStreamClass
} from "./private-stream"

import {
    gmoPublicStreamClass
} from "./public-stream"

import {
    SlackNotifier
} from "slack-notification"
import { gmoPrivateStreamExecutionResponse, gmoPrivateStreamOrderResponse, gmoPublicStreamTickerResponse } from ".."
import { gmoPair } from "./type"


export interface wsTrade {
    id: number;
    time: string;
    side: string;
    size: number;
    price: number;
    liquidation: boolean;
}

export interface wsTicker {
    time: string;
    bid: number;
    ask: number;
    last: number;
}

export interface wsFill {
    fee: number //78.05799225,
    feeRate: number //0.0014,
    future: string //BTC-PERP,
    id: number //7828307,
    liquidity: string //taker,
    market: string //BTC-PERP,
    orderId: number //38065410,
    tradeId: number //19129310,
    price: number //3723.75,
    side: string //buy,
    size: number //14.973,
    time: string //2019-05-07T16:40:58.358438+00:00,
    type: string //order
}

export interface wsOrder {
    id: number //24852229,
    clientId?: string //null,
    market: string //XRP-PERP,
    type: string //limit,
    side: string //buy,
    size: number //42353.0,
    price: number //0.2977,
    reduceOnly: boolean //false,
    ioc: boolean //false,
    postOnly: boolean //false,
    status: string //closed,
    filledSize: number //0.0,
    remainingSize: number //0.0,
    avgFillPrice: number //0.2978
    fee: number
}

export interface WebsocketAPIClientParams {
    notifier?: SlackNotifier,
    subscribeOrder: boolean,
    tickerSymbols: gmoPair[],
    account: string,
    onClientStart?: ()=>void
    onClientError?: ()=>void
    onClientOrder?: (order: wsOrder)=>void
    onClientTicker?: (ticker: wsTicker)=> void
}

export class WebsocketAPIClient {
    private isError: boolean = false
    private apiKey?: string
    private apiSecret?: string
    private privateStream?: gmoPrivateStreamClass
    private publicStream?: gmoPublicStreamClass
    private account?: string
    private tickerSymbols: gmoPair[]
    private subscribeOrder: boolean = true
    private notifier?: SlackNotifier
    private onClientStart?: ()=>void
    private onClientError?: ()=>void
    private onClientOrder?: (order: wsOrder)=>void
    private onClientTicker?: (ticker: wsTicker)=> void
    constructor(params: WebsocketAPIClientParams) {
        this.notifier = params.notifier
        this.subscribeOrder = params.subscribeOrder
        this.tickerSymbols = params.tickerSymbols
        this.account = params.account
        this.onClientStart = params.onClientStart 
        this.onClientError = params.onClientError
        this.onClientOrder = params.onClientOrder
        this.onClientTicker = params.onClientTicker
    }

    async Start() {
        const rdb = await getRealTimeDatabase()
        this.apiKey = await rdb.get(await rdb.getReference('settings/gmo/accounts/' + this.account + '/apiKey')) as string
        this.apiSecret = await rdb.get(await rdb.getReference('settings/gmo/accounts/' + this.apiSecret + '/apiSecret')) as string
        
        this.privateStream = new gmoPrivateStreamClass(
            this.apiKey, this.apiSecret, {
            reconnect: true,
            execution: this.onFill,
            order: this.onOrder,
            // position?: gmoPrivateStreamPositionCallback
            // summary?: gmoPrivateStreamSummaryCallback
            onWebSocketOpen: this.onPrivateStreamOpen,
            onWebSocketClose: this.onPrivateStreamClose,
            onWebSocketError: this.onPrivateStreamError
        })

        this.publicStream = new gmoPublicStreamClass({
            reconnect: true,
            ticker: this.onTicker,
            // orderbooks?: gmoPublicStreamOrderBooksCallback
            // trades?: gmoPublicStreamTradesCallback
            onWebSocketOpen: this.onPublicStreamOpen,
            onWebSocketClose: this.onPublicStreamClose,
            onWebSocketError: this.onPublicStreamError
        })
    }

    private onPrivateStreamOpen = async () => {
        this.notifier?.sendMessage("Private Stream Open")
        this.isError = false
        await sleep(1000)
        if (!this.isError) {
            if (this.subscribeOrder) {
                this.privateStream?.subscribe("executionEvents")
                this.privateStream?.subscribe("orderEvents")
            }
            if (this.onClientStart) {
                this.onClientStart()
            }
        }else{
            if (this.onClientError) {
                this.onClientError()
            }
        }
    }

    private onPrivateStreamClose = async () => {
        this.notifier?.sendMessage("Private Stream Close")
    }

    private onPrivateStreamError = async () => {
        this.notifier?.sendMessage("Private Stream Error")
    }

    private onPublicStreamOpen = async () => {
        this.notifier?.sendMessage("Public Stream Open")
        for (const m of this.tickerSymbols) {
            this.publicStream?.subscribe('ticker', m)
        }
    }

    private onPublicStreamClose = async () => {
        this.notifier?.sendMessage("Public Stream Close")
    }

    private onPublicStreamError = async () => {
        this.notifier?.sendMessage("Public Stream Error")
    }

    private onFill = (fill: gmoPrivateStreamExecutionResponse)=> {
        if (this.onClientOrder) {
            const o: wsOrder = {
                id: fill.orderId,
                market: fill.symbol,
                type: fill.executionType.toLowerCase(),
                side: fill.side.toLowerCase(),
                size: parseFloat(fill.orderSize),
                price: parseFloat(fill.orderPrice),
                reduceOnly: fill.settleType === 'CLOSE',
                ioc: false,
                postOnly: fill.timeInForce === 'SOK',
                status: parseFloat(fill.orderSize) - parseFloat(fill.orderExecutedSize) < 0.00001 ? 'closed': 'open',
                filledSize: parseFloat(fill.orderExecutedSize),
                remainingSize: parseFloat(fill.orderSize) - parseFloat(fill.orderExecutedSize),
                avgFillPrice: parseFloat(fill.executionPrice),
                fee: parseFloat(fill.fee)

            }
            this.onClientOrder(o)
        }
    }

    private onOrder = (order: gmoPrivateStreamOrderResponse)=> {
        if (this.onClientOrder) {
            const o: wsOrder = {
                id: order.orderId,
                market: order.symbol,
                type: order.executionType.toLowerCase(),
                side: order.side.toLowerCase(),
                size: parseFloat(order.orderSize),
                price: parseFloat(order.orderPrice),
                reduceOnly: order.settleType === 'CLOSE',
                ioc: false,
                postOnly: order.timeInForce === 'SOK',
                status: order.orderStatus,
                filledSize: parseFloat(order.orderExecutedSize),
                remainingSize: parseFloat(order.orderSize) - parseFloat(order.orderExecutedSize),
                avgFillPrice: parseFloat(order.orderPrice),
                fee: 0
            }
            this.onClientOrder(o)
        }
    }

    private onTicker = (ticker: gmoPublicStreamTickerResponse) => {
        if (this.onClientTicker) {
            const t: wsTicker = {
                time: ticker.timestamp,
                bid: parseFloat(ticker.bid),
                ask: parseFloat(ticker.ask),
                last: parseFloat(ticker.last)
            }
            this.onClientTicker(t)
        }
    }
}
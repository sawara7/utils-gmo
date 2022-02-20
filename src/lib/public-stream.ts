import websocket from 'ws';
import {
    gmoPublicStreamBaseResponse,
    gmoPublicStreamOrderBooksResponse,
    gmoPublicStreamTickerResponse,
    gmoPublicStreamTradesResponse
} from './responseType';
import {
    gmoPair,
    gmoWebsocketCommand,
    gmoWebsocketPublicChannel
} from './type';

const PATH = "wss://api.coin.z.com/ws/public/v1";

export type gmoPublicStreamTickerCallback = (ticker: gmoPublicStreamTickerResponse) => void;
export type gmoPublicStreamOrderBooksCallback = (orderbooks: gmoPublicStreamOrderBooksResponse) => void;
export type gmoPublicStreamTradesCallback = (trades: gmoPublicStreamTradesResponse) => void;

export type gmoPublicStreamOption = {
    reconnect: boolean
    ticker?: gmoPublicStreamTickerCallback
    orderbooks?: gmoPublicStreamOrderBooksCallback
    trades?: gmoPublicStreamTradesCallback
    onWebSocketOpen?: () => void
    onWebSocketClose?: () => void
    onWebSocketError?: () => void
}

export class gmoPublicStreamClass {
    private reconnect: boolean = true
    private ws: websocket | null = null
    private ticker?: gmoPublicStreamTickerCallback
    private orderbooks?: gmoPublicStreamOrderBooksCallback
    private trades?: gmoPublicStreamTradesCallback
    // WebSocket Events
    private onWebSocketOpen?: () => void
    private onWebSocketClose?: () => void
    private onWebSocketError?: () => void
    //
    constructor(option: gmoPublicStreamOption) {
        this.reconnect = option.reconnect
        this.ticker = option.ticker
        this.orderbooks = option.orderbooks
        this.trades = option.trades
        this.onWebSocketOpen = option.onWebSocketOpen
        this.onWebSocketClose = option.onWebSocketClose
        this.onWebSocketError = option.onWebSocketError
        this.initialize()
    }

    initialize() {
        this.ws = new websocket( PATH )
        this.ws.on("open", this.onOpen)
        this.ws.on("close", this.onClose)
        this.ws.on("error", this.onError)
        this.ws.on("ping", this.onPing)
        this.ws.on("message", this.onMessage)
    }

    private onPing = () => {
        this.ws?.pong()
    }

    private onOpen = () => {
        if (this.onWebSocketOpen){
            this.onWebSocketOpen()
        }
    }

    private onClose = () => {
        if (this.reconnect) {
            this.initialize()
        }
        if (this.onWebSocketClose){
            this.onWebSocketClose()
        }
    }

    private onError = () => {
        if (this.onWebSocketError){
            this.onWebSocketError()
        }
    }

    private onMessage = (data: websocket.RawData) => {
        const res = JSON.parse(data.toString()) as gmoPublicStreamBaseResponse;
        if (res.channel  === 'ticker'){
            if (this.ticker){
                this.ticker(res as gmoPublicStreamTickerResponse);
            }
        }else if(res.channel === 'orderbooks'){
            if (this.orderbooks){
                this.orderbooks(res as gmoPublicStreamOrderBooksResponse);
            }
        }else if(res.channel === 'trades'){
            if (this.trades){
                this.trades(res as gmoPublicStreamTradesResponse);
            }
        }
    }

    public subscribe(channel: gmoWebsocketPublicChannel, pair: gmoPair) {
        this.ws?.send(JSON.stringify(
            {
                "command": "subscribe",
                "channel": channel,
                "symbol": pair
            })
        )
    }
}
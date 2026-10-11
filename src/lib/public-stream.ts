import websocket from 'ws';
import { sleep } from 'utils-general'
import {
    gmoPublicStreamBaseResponse,
    gmoPublicStreamOrderBooksResponse,
    gmoPublicStreamTickerResponse,
    gmoPublicStreamTradesResponse
} from './responseType';
import {
    gmoPair,
    gmoTradesOption,
    gmoWebsocketPublicChannel
} from './type';

const PATH = "wss://api.coin.z.com/ws/public/v1";

// 同一IPからの subscribe / unsubscribe は1秒1回が上限。
const SUBSCRIBE_INTERVAL = 1000;

export type gmoPublicStreamTickerCallback = (ticker: gmoPublicStreamTickerResponse) => void;
export type gmoPublicStreamOrderBooksCallback = (orderbooks: gmoPublicStreamOrderBooksResponse) => void;
export type gmoPublicStreamTradesCallback = (trades: gmoPublicStreamTradesResponse) => void;

export type gmoPublicStreamCallbacks = {
    ticker?: gmoPublicStreamTickerCallback
    orderbooks?: gmoPublicStreamOrderBooksCallback
    trades?: gmoPublicStreamTradesCallback
}

export type gmoPublicStreamOption = gmoPublicStreamCallbacks & {
    reconnect: boolean
    onWebSocketOpen?: () => void
    onWebSocketClose?: () => void
    onWebSocketError?: () => void
}

// 受信メッセージの振り分け。テストしやすいようにクラスから切り出している。
// 対応するチャンネルを処理した場合に true を返す。
export function dispatchPublicStreamMessage(message: string, callbacks: gmoPublicStreamCallbacks): boolean {
    const res = JSON.parse(message) as gmoPublicStreamBaseResponse;
    if (res.channel === 'ticker') {
        if (callbacks.ticker) { callbacks.ticker(res as gmoPublicStreamTickerResponse) }
        return true
    } else if (res.channel === 'orderbooks') {
        if (callbacks.orderbooks) { callbacks.orderbooks(res as gmoPublicStreamOrderBooksResponse) }
        return true
    } else if (res.channel === 'trades') {
        if (callbacks.trades) { callbacks.trades(res as gmoPublicStreamTradesResponse) }
        return true
    }
    return false
}

export class gmoPublicStreamClass {
    private reconnect: boolean = true
    private ws: websocket | null = null
    private callbacks: gmoPublicStreamCallbacks
    // WebSocket Events
    private onWebSocketOpen?: () => void
    private onWebSocketClose?: () => void
    private onWebSocketError?: () => void
    // internal
    private sendQueue: Promise<void> = Promise.resolve()
    private lastSendTime: number = 0
    //
    constructor(option: gmoPublicStreamOption) {
        this.reconnect = option.reconnect
        this.callbacks = {
            ticker: option.ticker,
            orderbooks: option.orderbooks,
            trades: option.trades
        }
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

    // サーバーから1分に1回pingが来る。3回連続で応答しないと切断される。
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
        dispatchPublicStreamMessage(data.toString(), this.callbacks)
    }

    // 再接続を止めて接続を終了する。
    public close() {
        this.reconnect = false
        this.ws?.close()
    }

    // option: 'TAKER_ONLY' は trades チャンネルのみ指定可能。
    public subscribe(channel: gmoWebsocketPublicChannel, pair: gmoPair, option?: gmoTradesOption): Promise<void> {
        const message = {
            "command": "subscribe",
            "channel": channel,
            "symbol": pair
        }
        if (option) {
            Object.assign(message, { "option": option })
        }
        return this.send(message)
    }

    public unsubscribe(channel: gmoWebsocketPublicChannel, pair: gmoPair): Promise<void> {
        return this.send({
            "command": "unsubscribe",
            "channel": channel,
            "symbol": pair
        })
    }

    // 1秒1回の制限を守るため、送信を直列化して間隔を空ける。
    private send(message: {}): Promise<void> {
        this.sendQueue = this.sendQueue.then(async () => {
            const wait = SUBSCRIBE_INTERVAL - (Date.now() - this.lastSendTime)
            if (wait > 0) {
                await sleep(wait)
            }
            this.lastSendTime = Date.now()
            this.ws?.send(JSON.stringify(message))
        })
        return this.sendQueue
    }
}

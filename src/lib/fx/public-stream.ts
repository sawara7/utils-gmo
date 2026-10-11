import websocket from 'ws';
import { sleep } from 'utils-general';
import {
    gmoFXPublicStreamTickerResponse
} from './responseType';
import {
    gmoFXSymbol,
    gmoFXWebsocketPublicChannel
} from './type';

const PATH = 'wss://forex-api.coin.z.com/ws/public/v1';

// 同一IPからの subscribe / unsubscribe は1秒1回が上限。
const SUBSCRIBE_INTERVAL = 1000;

export type gmoFXPublicStreamTickerCallback = (ticker: gmoFXPublicStreamTickerResponse) => void;

export type gmoFXPublicStreamCallbacks = {
    ticker?: gmoFXPublicStreamTickerCallback
}

export type gmoFXPublicStreamOption = gmoFXPublicStreamCallbacks & {
    reconnect: boolean
    onWebSocketOpen?: () => void
    onWebSocketClose?: () => void
    onWebSocketError?: () => void
}

// 受信メッセージの振り分け。テストしやすいようにクラスから切り出している。
// 外国為替FXのtickerは暗号資産と違い channel を返さないため、
// bid / ask を持つメッセージを ticker として扱う。
// 対応するメッセージを処理した場合に true を返す。
export function dispatchFXPublicStreamMessage(message: string, callbacks: gmoFXPublicStreamCallbacks): boolean {
    const res = JSON.parse(message)
    if (res.bid !== undefined && res.ask !== undefined) {
        if (callbacks.ticker) { callbacks.ticker(res as gmoFXPublicStreamTickerResponse) }
        return true
    }
    return false
}

export class gmoFXPublicStreamClass {
    private reconnect: boolean = true
    private ws: websocket | null = null
    private callbacks: gmoFXPublicStreamCallbacks
    // WebSocket Events
    private onWebSocketOpen?: () => void
    private onWebSocketClose?: () => void
    private onWebSocketError?: () => void
    // internal
    private sendQueue: Promise<void> = Promise.resolve()
    private lastSendTime: number = 0
    //
    constructor(option: gmoFXPublicStreamOption) {
        this.reconnect = option.reconnect
        this.callbacks = { ticker: option.ticker }
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
        dispatchFXPublicStreamMessage(data.toString(), this.callbacks)
    }

    // 再接続を止めて接続を終了する。
    public close() {
        this.reconnect = false
        this.ws?.close()
    }

    public subscribe(channel: gmoFXWebsocketPublicChannel, symbol: gmoFXSymbol): Promise<void> {
        return this.send({
            "command": "subscribe",
            "channel": channel,
            "symbol": symbol
        })
    }

    public unsubscribe(channel: gmoFXWebsocketPublicChannel, symbol: gmoFXSymbol): Promise<void> {
        return this.send({
            "command": "unsubscribe",
            "channel": channel,
            "symbol": symbol
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

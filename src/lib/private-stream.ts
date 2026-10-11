import websocket from 'ws'
import { sleep } from 'utils-general'
import {
    gmoPrivateApiClass
} from './private-api'
import {
    gmoPrivateStreamExecutionResponse,
    gmoPrivateStreamOrderResponse,
    gmoPrivateStreamPositionResponse,
    gmoPrivateStreamPositionSummaryResponse,
    gmoStreamBaseResponse
} from './responseType';
import {
    gmoPositionSummaryOption,
    gmoWebsocketPrivateChannel
} from './type';

const PATH = "wss://api.coin.z.com/ws/private/v1/";

// 同一IPからの subscribe / unsubscribe は1秒1回が上限。
const SUBSCRIBE_INTERVAL = 1000;

// アクセストークンの有効期限は60分。切れる前に延長する。
const TOKEN_UPDATE_INTERVAL = 30 * 60 * 1000;

export type gmoPrivateStreamExecutionCallback = (execution: gmoPrivateStreamExecutionResponse) => void;
export type gmoPrivateStreamOrderCallback = (order: gmoPrivateStreamOrderResponse) => void;
export type gmoPrivateStreamPositionCallback = (position: gmoPrivateStreamPositionResponse) => void;
export type gmoPrivateStreamSummaryCallback = (summary: gmoPrivateStreamPositionSummaryResponse) => void;

export type gmoPrivateStreamCallbacks = {
    execution?: gmoPrivateStreamExecutionCallback
    order?: gmoPrivateStreamOrderCallback
    position?: gmoPrivateStreamPositionCallback
    summary?: gmoPrivateStreamSummaryCallback
}

export type gmoPrivateStreamOption = gmoPrivateStreamCallbacks & {
    reconnect: boolean
    onWebSocketOpen?: () => void
    onWebSocketClose?: () => void
    onWebSocketError?: () => void
}

// 受信メッセージの振り分け。テストしやすいようにクラスから切り出している。
// 対応するチャンネルを処理した場合に true を返す。
export function dispatchPrivateStreamMessage(message: string, callbacks: gmoPrivateStreamCallbacks): boolean {
    const res = JSON.parse(message) as gmoStreamBaseResponse;
    if (res.channel === 'executionEvents') {
        if (callbacks.execution) { callbacks.execution(res as gmoPrivateStreamExecutionResponse) }
        return true
    } else if (res.channel === 'orderEvents') {
        if (callbacks.order) { callbacks.order(res as gmoPrivateStreamOrderResponse) }
        return true
    } else if (res.channel === 'positionEvents') {
        if (callbacks.position) { callbacks.position(res as gmoPrivateStreamPositionResponse) }
        return true
    } else if (res.channel === 'positionSummaryEvents') {
        if (callbacks.summary) { callbacks.summary(res as gmoPrivateStreamPositionSummaryResponse) }
        return true
    }
    return false
}

export class gmoPrivateStreamAPIClass {
    private reconnect: boolean = true
    private ws: websocket | null = null
    private api: gmoPrivateApiClass
    private token: string = ''
    private callbacks: gmoPrivateStreamCallbacks
    executionCallback?: gmoPrivateStreamExecutionCallback
    orderCallback?: gmoPrivateStreamOrderCallback
    positionCallback?: gmoPrivateStreamPositionCallback
    summaryCallback?: gmoPrivateStreamSummaryCallback
    // WebSocket Events
    private onWebSocketOpen?: () => void
    private onWebSocketClose?: () => void
    private onWebSocketError?: () => void
    // internal
    private intervalID?: NodeJS.Timeout
    private sendQueue: Promise<void> = Promise.resolve()
    private lastSendTime: number = 0

    constructor(apiKey: string, apiSecret: string, option: gmoPrivateStreamOption) {
        this.api = new gmoPrivateApiClass({
            apiKey: apiKey,
            apiSecret: apiSecret
        })
        this.reconnect = option.reconnect
        this.executionCallback = option.execution
        this.orderCallback = option.order
        this.positionCallback = option.position
        this.summaryCallback = option.summary
        this.callbacks = {
            execution: (res) => { if (this.executionCallback) { this.executionCallback(res) } },
            order: (res) => { if (this.orderCallback) { this.orderCallback(res) } },
            position: (res) => { if (this.positionCallback) { this.positionCallback(res) } },
            summary: (res) => { if (this.summaryCallback) { this.summaryCallback(res) } }
        }
        this.onWebSocketOpen = option.onWebSocketOpen
        this.onWebSocketClose = option.onWebSocketClose
        this.onWebSocketError = option.onWebSocketError
        this.initialize()
    }

    private async initialize() {
        if (this.intervalID) {
            clearInterval(this.intervalID)
            this.intervalID = undefined
        }
        const res = await this.api.getWebsocketAccessToken()
        if (!res || !res.data){throw 'Websocket access token not created.'}
        this.token = res.data
        this.intervalID = setInterval(async()=>{
            await this.api.updateWebsocketAccessToken(this.token)
        }, TOKEN_UPDATE_INTERVAL)
        this.ws = new websocket( PATH + this.token )
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
        dispatchPrivateStreamMessage(data.toString(), this.callbacks)
    }

    // アクセストークンを削除して接続を終了する。
    public async close(): Promise<void> {
        this.reconnect = false
        if (this.intervalID) {
            clearInterval(this.intervalID)
            this.intervalID = undefined
        }
        this.ws?.close()
        if (this.token) {
            await this.api.deleteWebsocketAccessToken(this.token)
            this.token = ''
        }
    }

    // option: 'PERIODIC' は positionSummaryEvents のみ指定可能（5秒ごとに配信）。
    public subscribe(channel: gmoWebsocketPrivateChannel, option?: gmoPositionSummaryOption): Promise<void> {
        const message = {
            "command": "subscribe",
            "channel": channel
        }
        if (option) {
            Object.assign(message, { "option": option })
        }
        return this.send(message)
    }

    public unsubscribe(channel: gmoWebsocketPrivateChannel): Promise<void> {
        return this.send({
            "command": "unsubscribe",
            "channel": channel
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

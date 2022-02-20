import websocket from 'ws'
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
    gmoWebsocketPrivateChannel
} from './type';

const PATH = "wss://api.coin.z.com/ws/private/v1/";

export type gmoPrivateStreamExecutionCallback = (execution: gmoPrivateStreamExecutionResponse) => void;
export type gmoPrivateStreamOrderCallback = (order: gmoPrivateStreamOrderResponse) => void;
export type gmoPrivateStreamPositionCallback = (position: gmoPrivateStreamPositionResponse) => void;
export type gmoPrivateStreamSummaryCallback = (summary: gmoPrivateStreamPositionSummaryResponse) => void;

export type gmoPrivateStreamOption = {
    reconnect: boolean
    execution?: gmoPrivateStreamExecutionCallback
    order?: gmoPrivateStreamOrderCallback
    position?: gmoPrivateStreamPositionCallback
    summary?: gmoPrivateStreamSummaryCallback
    onWebSocketOpen?: () => void
    onWebSocketClose?: () => void
    onWebSocketError?: () => void
}

export class gmoPrivateStreamAPIClass {
    private reconnect: boolean = true
    private ws: websocket | null = null
    private api: gmoPrivateApiClass
    private token: string = ''
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
        }, 30 * 60 * 1000)
        this.ws = new websocket( PATH + this.token )
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
        const res = JSON.parse(data.toString()) as gmoStreamBaseResponse;
        if (res.channel  === 'executionEvents'){
            if (this.executionCallback){
                this.executionCallback(res as gmoPrivateStreamExecutionResponse);
            };
        }else if(res.channel === 'orderEvents'){
            if (this.orderCallback){
                this.orderCallback(res as gmoPrivateStreamOrderResponse);
            };
        }else if(res.channel === 'positionEvents'){
            if (this.positionCallback){
                this.positionCallback(res as gmoPrivateStreamPositionResponse);
            };
        }else if(res.channel === 'positionSummary'){
            if (this.summaryCallback){
                this.summaryCallback(res as gmoPrivateStreamPositionSummaryResponse);
            };
        }
    }

    public subscribe(channel: gmoWebsocketPrivateChannel){
        if (this.ws){
            this.ws.send(JSON.stringify({
                "command": "subscribe",
                "channel": channel,
            }));
        }
    }
}
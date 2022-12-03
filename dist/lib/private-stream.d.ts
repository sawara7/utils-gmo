import { gmoPrivateStreamExecutionResponse, gmoPrivateStreamOrderResponse, gmoPrivateStreamPositionResponse, gmoPrivateStreamPositionSummaryResponse } from './responseType';
import { gmoWebsocketPrivateChannel } from './type';
export type gmoPrivateStreamExecutionCallback = (execution: gmoPrivateStreamExecutionResponse) => void;
export type gmoPrivateStreamOrderCallback = (order: gmoPrivateStreamOrderResponse) => void;
export type gmoPrivateStreamPositionCallback = (position: gmoPrivateStreamPositionResponse) => void;
export type gmoPrivateStreamSummaryCallback = (summary: gmoPrivateStreamPositionSummaryResponse) => void;
export type gmoPrivateStreamOption = {
    reconnect: boolean;
    execution?: gmoPrivateStreamExecutionCallback;
    order?: gmoPrivateStreamOrderCallback;
    position?: gmoPrivateStreamPositionCallback;
    summary?: gmoPrivateStreamSummaryCallback;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare class gmoPrivateStreamAPIClass {
    private reconnect;
    private ws;
    private api;
    private token;
    executionCallback?: gmoPrivateStreamExecutionCallback;
    orderCallback?: gmoPrivateStreamOrderCallback;
    positionCallback?: gmoPrivateStreamPositionCallback;
    summaryCallback?: gmoPrivateStreamSummaryCallback;
    private onWebSocketOpen?;
    private onWebSocketClose?;
    private onWebSocketError?;
    private intervalID?;
    constructor(apiKey: string, apiSecret: string, option: gmoPrivateStreamOption);
    private initialize;
    private onPing;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    subscribe(channel: gmoWebsocketPrivateChannel): void;
}

import { gmoFXPrivateStreamExecutionResponse, gmoFXPrivateStreamOrderResponse, gmoFXPrivateStreamPositionResponse, gmoFXPrivateStreamPositionSummaryResponse } from './responseType';
import { gmoFXPositionSummaryOption, gmoFXWebsocketPrivateChannel } from './type';
export type gmoFXPrivateStreamExecutionCallback = (execution: gmoFXPrivateStreamExecutionResponse) => void;
export type gmoFXPrivateStreamOrderCallback = (order: gmoFXPrivateStreamOrderResponse) => void;
export type gmoFXPrivateStreamPositionCallback = (position: gmoFXPrivateStreamPositionResponse) => void;
export type gmoFXPrivateStreamSummaryCallback = (summary: gmoFXPrivateStreamPositionSummaryResponse) => void;
export type gmoFXPrivateStreamCallbacks = {
    execution?: gmoFXPrivateStreamExecutionCallback;
    order?: gmoFXPrivateStreamOrderCallback;
    position?: gmoFXPrivateStreamPositionCallback;
    summary?: gmoFXPrivateStreamSummaryCallback;
};
export type gmoFXPrivateStreamOption = gmoFXPrivateStreamCallbacks & {
    reconnect: boolean;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare function dispatchFXPrivateStreamMessage(message: string, callbacks: gmoFXPrivateStreamCallbacks): boolean;
export declare class gmoFXPrivateStreamClass {
    private reconnect;
    private ws;
    private api;
    private token;
    private callbacks;
    executionCallback?: gmoFXPrivateStreamExecutionCallback;
    orderCallback?: gmoFXPrivateStreamOrderCallback;
    positionCallback?: gmoFXPrivateStreamPositionCallback;
    summaryCallback?: gmoFXPrivateStreamSummaryCallback;
    private onWebSocketOpen?;
    private onWebSocketClose?;
    private onWebSocketError?;
    private intervalID?;
    private sendQueue;
    private lastSendTime;
    constructor(apiKey: string, apiSecret: string, option: gmoFXPrivateStreamOption);
    private initialize;
    private onPing;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    subscribe(channel: gmoFXWebsocketPrivateChannel, option?: gmoFXPositionSummaryOption): Promise<void>;
    unsubscribe(channel: gmoFXWebsocketPrivateChannel): Promise<void>;
    close(): Promise<void>;
    private send;
}

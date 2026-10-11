import { gmoPrivateStreamExecutionResponse, gmoPrivateStreamOrderResponse, gmoPrivateStreamPositionResponse, gmoPrivateStreamPositionSummaryResponse } from './responseType';
import { gmoPositionSummaryOption, gmoWebsocketPrivateChannel } from './type';
export type gmoPrivateStreamExecutionCallback = (execution: gmoPrivateStreamExecutionResponse) => void;
export type gmoPrivateStreamOrderCallback = (order: gmoPrivateStreamOrderResponse) => void;
export type gmoPrivateStreamPositionCallback = (position: gmoPrivateStreamPositionResponse) => void;
export type gmoPrivateStreamSummaryCallback = (summary: gmoPrivateStreamPositionSummaryResponse) => void;
export type gmoPrivateStreamCallbacks = {
    execution?: gmoPrivateStreamExecutionCallback;
    order?: gmoPrivateStreamOrderCallback;
    position?: gmoPrivateStreamPositionCallback;
    summary?: gmoPrivateStreamSummaryCallback;
};
export type gmoPrivateStreamOption = gmoPrivateStreamCallbacks & {
    reconnect: boolean;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare function dispatchPrivateStreamMessage(message: string, callbacks: gmoPrivateStreamCallbacks): boolean;
export declare class gmoPrivateStreamAPIClass {
    private reconnect;
    private ws;
    private api;
    private token;
    private callbacks;
    executionCallback?: gmoPrivateStreamExecutionCallback;
    orderCallback?: gmoPrivateStreamOrderCallback;
    positionCallback?: gmoPrivateStreamPositionCallback;
    summaryCallback?: gmoPrivateStreamSummaryCallback;
    private onWebSocketOpen?;
    private onWebSocketClose?;
    private onWebSocketError?;
    private intervalID?;
    private sendQueue;
    private lastSendTime;
    constructor(apiKey: string, apiSecret: string, option: gmoPrivateStreamOption);
    private initialize;
    private onPing;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    close(): Promise<void>;
    subscribe(channel: gmoWebsocketPrivateChannel, option?: gmoPositionSummaryOption): Promise<void>;
    unsubscribe(channel: gmoWebsocketPrivateChannel): Promise<void>;
    private send;
}

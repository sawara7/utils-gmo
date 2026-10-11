import { gmoFXPublicStreamTickerResponse } from './responseType';
import { gmoFXSymbol, gmoFXWebsocketPublicChannel } from './type';
export type gmoFXPublicStreamTickerCallback = (ticker: gmoFXPublicStreamTickerResponse) => void;
export type gmoFXPublicStreamCallbacks = {
    ticker?: gmoFXPublicStreamTickerCallback;
};
export type gmoFXPublicStreamOption = gmoFXPublicStreamCallbacks & {
    reconnect: boolean;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare function dispatchFXPublicStreamMessage(message: string, callbacks: gmoFXPublicStreamCallbacks): boolean;
export declare class gmoFXPublicStreamClass {
    private reconnect;
    private ws;
    private callbacks;
    private onWebSocketOpen?;
    private onWebSocketClose?;
    private onWebSocketError?;
    private sendQueue;
    private lastSendTime;
    constructor(option: gmoFXPublicStreamOption);
    initialize(): void;
    private onPing;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    close(): void;
    subscribe(channel: gmoFXWebsocketPublicChannel, symbol: gmoFXSymbol): Promise<void>;
    unsubscribe(channel: gmoFXWebsocketPublicChannel, symbol: gmoFXSymbol): Promise<void>;
    private send;
}

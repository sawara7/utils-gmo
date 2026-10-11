import { gmoFXPublicStreamTickerResponse } from './responseType';
import { gmoFXSymbol, gmoFXWebsocketPublicChannel } from './type';
export type gmoFXPublicStreamTickerCallback = (ticker: gmoFXPublicStreamTickerResponse) => void;
export type gmoFXPublicStreamOption = {
    reconnect: boolean;
    ticker?: gmoFXPublicStreamTickerCallback;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare class gmoFXPublicStreamClass {
    private reconnect;
    private ws;
    private ticker?;
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

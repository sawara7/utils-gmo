import { gmoPublicStreamOrderBooksResponse, gmoPublicStreamTickerResponse, gmoPublicStreamTradesResponse } from './responseType';
import { gmoPair, gmoTradesOption, gmoWebsocketPublicChannel } from './type';
export type gmoPublicStreamTickerCallback = (ticker: gmoPublicStreamTickerResponse) => void;
export type gmoPublicStreamOrderBooksCallback = (orderbooks: gmoPublicStreamOrderBooksResponse) => void;
export type gmoPublicStreamTradesCallback = (trades: gmoPublicStreamTradesResponse) => void;
export type gmoPublicStreamCallbacks = {
    ticker?: gmoPublicStreamTickerCallback;
    orderbooks?: gmoPublicStreamOrderBooksCallback;
    trades?: gmoPublicStreamTradesCallback;
};
export type gmoPublicStreamOption = gmoPublicStreamCallbacks & {
    reconnect: boolean;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare function dispatchPublicStreamMessage(message: string, callbacks: gmoPublicStreamCallbacks): boolean;
export declare class gmoPublicStreamClass {
    private reconnect;
    private ws;
    private callbacks;
    private onWebSocketOpen?;
    private onWebSocketClose?;
    private onWebSocketError?;
    private sendQueue;
    private lastSendTime;
    constructor(option: gmoPublicStreamOption);
    initialize(): void;
    private onPing;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    close(): void;
    subscribe(channel: gmoWebsocketPublicChannel, pair: gmoPair, option?: gmoTradesOption): Promise<void>;
    unsubscribe(channel: gmoWebsocketPublicChannel, pair: gmoPair): Promise<void>;
    private send;
}

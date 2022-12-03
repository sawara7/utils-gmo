import { gmoPublicStreamOrderBooksResponse, gmoPublicStreamTickerResponse, gmoPublicStreamTradesResponse } from './responseType';
import { gmoPair, gmoWebsocketPublicChannel } from './type';
export type gmoPublicStreamTickerCallback = (ticker: gmoPublicStreamTickerResponse) => void;
export type gmoPublicStreamOrderBooksCallback = (orderbooks: gmoPublicStreamOrderBooksResponse) => void;
export type gmoPublicStreamTradesCallback = (trades: gmoPublicStreamTradesResponse) => void;
export type gmoPublicStreamOption = {
    reconnect: boolean;
    ticker?: gmoPublicStreamTickerCallback;
    orderbooks?: gmoPublicStreamOrderBooksCallback;
    trades?: gmoPublicStreamTradesCallback;
    onWebSocketOpen?: () => void;
    onWebSocketClose?: () => void;
    onWebSocketError?: () => void;
};
export declare class gmoPublicStreamClass {
    private reconnect;
    private ws;
    private ticker?;
    private orderbooks?;
    private trades?;
    private onWebSocketOpen?;
    private onWebSocketClose?;
    private onWebSocketError?;
    constructor(option: gmoPublicStreamOption);
    initialize(): void;
    private onPing;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    subscribe(channel: gmoWebsocketPublicChannel, pair: gmoPair): void;
}

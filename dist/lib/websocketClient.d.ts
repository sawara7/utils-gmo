import { GMOApiConfig, gmoPair } from "./type";
export interface wsTrade {
    id: number;
    time: string;
    side: string;
    size: number;
    price: number;
    liquidation: boolean;
}
export interface wsTicker {
    time: string;
    bid: number;
    ask: number;
    last: number;
}
export interface wsFill {
    fee: number;
    feeRate: number;
    future: string;
    id: number;
    liquidity: string;
    market: string;
    orderId: number;
    tradeId: number;
    price: number;
    side: string;
    size: number;
    time: string;
    type: string;
}
export interface wsOrder {
    id: number;
    clientId?: string;
    market: string;
    type: string;
    side: string;
    size: number;
    price: number;
    reduceOnly: boolean;
    ioc: boolean;
    postOnly: boolean;
    status: string;
    filledSize: number;
    remainingSize: number;
    avgFillPrice: number;
    fee: number;
}
export interface WebsocketAPIClientParams {
    apiSettings: GMOApiConfig;
    subscribeOrder: boolean;
    tickerSymbols: gmoPair[];
    account: string;
    onClientStart?: () => void;
    onClientError?: () => void;
    onClientOrder?: (order: wsOrder) => void;
    onClientTicker?: (ticker: wsTicker) => void;
}
export declare class WebsocketAPIClient {
    private isError;
    private apiKey;
    private apiSecret;
    private privateStream?;
    private publicStream?;
    private account?;
    private tickerSymbols;
    private subscribeOrder;
    private onClientStart?;
    private onClientError?;
    private onClientOrder?;
    private onClientTicker?;
    constructor(params: WebsocketAPIClientParams);
    Start(): Promise<void>;
    private onPrivateStreamOpen;
    private onPrivateStreamClose;
    private onPrivateStreamError;
    private onPublicStreamOpen;
    private onPublicStreamClose;
    private onPublicStreamError;
    private onFill;
    private onOrder;
    private onTicker;
}

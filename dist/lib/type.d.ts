export declare const GMO_API_NAME = "gmo";
export interface ApiConfig {
    endPoint?: string;
    keepAlive?: boolean;
    timeout?: number;
}
export interface GMOApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
}
export declare type gmoStatus = 'MAINTENANCE' | 'REOPEN' | 'OPEN';
export declare type gmoWebsocketCommand = 'subscribe' | 'unsubscribe';
export declare const gmoWebsocketPublicChannels: readonly ["ticker", "trades", "orderbooks"];
export declare type gmoWebsocketPublicChannel = typeof gmoWebsocketPublicChannels[number];
export declare const gmoWebsocketPrivateChannels: readonly ["executionEvents", "orderEvents", "positionEvents", "positionSummaryEvents"];
export declare type gmoWebsocketPrivateChannel = typeof gmoWebsocketPrivateChannels[number];
export declare const gmoPairs: readonly ["BTC", "ETH", "BCH", "LTC", "XRP", "BTC_JPY", "ETH_JPY", "BCH_JPY", "LTC_JPY", "XRP_JPY"];
export declare type gmoPair = typeof gmoPairs[number];

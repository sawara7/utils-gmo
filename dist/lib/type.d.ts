export declare const GMO_API_NAME = "gmo";
export interface ApiConfig {
    endPoint?: string;
    keepAlive?: boolean;
    timeout?: number;
    sendingInterval?: number;
    maxWaiting?: number;
}
export interface GMOApiConfig extends ApiConfig {
    apiKey: string;
    apiSecret: string;
    debug?: boolean;
}
export declare const MarginCallStatusList: readonly ["DEFAULT", "INVERSE", "BID", "ASK", "MID"];
export type MarginCallStatus = typeof MarginCallStatusList[number];
export type gmoStatus = 'MAINTENANCE' | 'PREOPEN' | 'OPEN';
export type gmoWebsocketCommand = 'subscribe' | 'unsubscribe';
export declare const gmoWebsocketPublicChannels: readonly ["ticker", "trades", "orderbooks"];
export type gmoWebsocketPublicChannel = typeof gmoWebsocketPublicChannels[number];
export declare const gmoWebsocketPrivateChannels: readonly ["executionEvents", "orderEvents", "positionEvents", "positionSummaryEvents"];
export type gmoWebsocketPrivateChannel = typeof gmoWebsocketPrivateChannels[number];
export declare const gmoSpotPairs: readonly ["BTC", "ETH", "BCH", "LTC", "XRP", "XLM", "DOT", "ATOM", "FCR", "ADA", "LINK", "DOGE", "SOL", "ASTR", "NAC", "WILD", "SUI"];
export type gmoSpotPair = typeof gmoSpotPairs[number];
export declare const gmoLeveragePairs: readonly ["BTC_JPY", "ETH_JPY", "BCH_JPY", "LTC_JPY", "XRP_JPY", "DOT_JPY", "ATOM_JPY", "ADA_JPY", "LINK_JPY", "DOGE_JPY", "SOL_JPY", "SUI_JPY"];
export type gmoLeveragePair = typeof gmoLeveragePairs[number];
export declare const gmoPairs: readonly ["BTC", "ETH", "BCH", "LTC", "XRP", "XLM", "DOT", "ATOM", "FCR", "ADA", "LINK", "DOGE", "SOL", "ASTR", "NAC", "WILD", "SUI", "BTC_JPY", "ETH_JPY", "BCH_JPY", "LTC_JPY", "XRP_JPY", "DOT_JPY", "ATOM_JPY", "ADA_JPY", "LINK_JPY", "DOGE_JPY", "SOL_JPY", "SUI_JPY"];
export type gmoPair = typeof gmoPairs[number];
export type gmoTradesOption = 'TAKER_ONLY';
export type gmoPositionSummaryOption = 'PERIODIC';
export type gmoExecutionMsgType = 'ER';
export type gmoOrderMsgType = 'NOR' | 'ROR' | 'COR' | 'ER';
export type gmoPositionMsgType = 'OPR' | 'UPR' | 'ULR' | 'CPR';
export type gmoPositionSummaryMsgType = 'INIT' | 'UPDATE' | 'PERIODIC';

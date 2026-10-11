import { gmoFXExecutionType, gmoFXIfdExecutionType, gmoFXKLineInterval, gmoFXPriceType, gmoFXSide, gmoFXSymbol } from './type';
export interface GetFXKLinesRequest {
    symbol: gmoFXSymbol;
    priceType: gmoFXPriceType;
    interval: gmoFXKLineInterval;
    date: string;
}
export interface GetFXOrdersRequest {
    rootOrderId?: number | number[];
    orderId?: number | number[];
}
export interface GetFXActiveOrdersRequest {
    symbol?: gmoFXSymbol;
    prevId?: number;
    count?: number;
}
export interface GetFXExecutionsRequest {
    orderId?: number;
    executionId?: number | number[];
}
export interface GetFXLatestExecutionsRequest {
    symbol: gmoFXSymbol;
    count?: number;
}
export interface GetFXOpenPositionsRequest {
    symbol?: gmoFXSymbol;
    prevId?: number;
    count?: number;
}
export interface GetFXPositionSummaryRequest {
    symbol?: gmoFXSymbol;
}
export interface PostFXSpeedOrderRequest {
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    size: string;
    clientOrderId?: string;
    lowerBound?: string;
    upperBound?: string;
    isHedgeable?: boolean;
}
export interface PostFXOrderRequest {
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    size: string;
    executionType: gmoFXExecutionType;
    clientOrderId?: string;
    limitPrice?: string;
    stopPrice?: string;
    lowerBound?: string;
    upperBound?: string;
}
export interface PostFXIfdOrderRequest {
    symbol: gmoFXSymbol;
    firstSide: gmoFXSide;
    firstExecutionType: gmoFXIfdExecutionType;
    firstSize: string;
    firstPrice: string;
    secondExecutionType: gmoFXIfdExecutionType;
    secondSize: string;
    secondPrice: string;
    clientOrderId?: string;
}
export interface PostFXIfoOrderRequest {
    symbol: gmoFXSymbol;
    firstSide: gmoFXSide;
    firstExecutionType: gmoFXIfdExecutionType;
    firstSize: string;
    firstPrice: string;
    secondSize: string;
    secondLimitPrice: string;
    secondStopPrice: string;
    clientOrderId?: string;
}
export interface PostFXChangeOrderRequest {
    price: string;
    orderId?: number;
    clientOrderId?: string;
}
export interface PostFXChangeOcoOrderRequest {
    rootOrderId?: number;
    clientOrderId?: string;
    limitPrice?: string;
    stopPrice?: string;
}
export interface PostFXChangeIfdOrderRequest {
    rootOrderId?: number;
    clientOrderId?: string;
    firstPrice?: string;
    secondPrice?: string;
}
export interface PostFXChangeIfoOrderRequest {
    rootOrderId?: number;
    clientOrderId?: string;
    firstPrice?: string;
    secondLimitPrice?: string;
    secondStopPrice?: string;
}
export interface PostFXCancelOrdersRequest {
    rootOrderIds?: number[];
    clientOrderIds?: string[];
}
export interface PostFXCancelBulkOrderRequest {
    symbols: gmoFXSymbol[];
    side?: gmoFXSide;
    settleType?: 'OPEN' | 'CLOSE';
}
export interface FXSettlePositionType {
    positionId: number;
    size: string;
}
export interface PostFXCloseOrderRequest {
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    executionType: gmoFXExecutionType;
    clientOrderId?: string;
    size?: string;
    settlePosition?: FXSettlePositionType[];
    limitPrice?: string;
    stopPrice?: string;
    lowerBound?: string;
    upperBound?: string;
}

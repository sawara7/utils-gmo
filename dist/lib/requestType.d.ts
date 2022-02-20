export interface GetTickerRequest {
    symbol?: string;
}
export interface GetOrderbooksRequest {
    symbol: string;
}
export interface GetTradesRequest {
    symbol: string;
    page?: number;
    count?: number;
}
export interface BasePostOrderRequest {
    symbol: string;
    side: string;
    executionType: string;
    timeInForce?: string;
    price?: string;
    losscutPrice?: string;
}
export interface PostOrderRequest extends BasePostOrderRequest {
    size: string;
}
export interface SettlePositionType {
    positionId: number;
    size: number;
}
export interface PostCloseOrderRequest extends BasePostOrderRequest {
    settlePosition: SettlePositionType;
}
export interface PostCloseBulkOrderRequest extends BasePostOrderRequest {
    size: string;
}
export interface CancelOrderRequest {
    orderId: number;
}
export interface CancelBulkOrderRequest {
    symbols: string[];
    side?: string;
    settleType?: string;
    desc?: boolean;
}
export interface GetActiveOrderRequest {
    symbol: string;
    page: number;
    count: number;
}

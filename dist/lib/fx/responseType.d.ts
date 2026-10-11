import { gmoFXCancelType, gmoFXExecutionMsgType, gmoFXOrderExecutionType, gmoFXOrderMsgType, gmoFXOrderStatus, gmoFXOrderType, gmoFXPositionMsgType, gmoFXPositionSummaryMsgType, gmoFXSettleType, gmoFXSide, gmoFXStatus, gmoFXSymbol, gmoFXWebsocketPrivateChannel } from './type';
export interface gmoFXStatusResponse {
    status: gmoFXStatus;
}
export interface gmoFXSymbolResponse {
    symbol: gmoFXSymbol;
    minOpenOrderSize: string;
    maxOrderSize: string;
    sizeStep: string;
    tickSize: string;
}
export interface gmoFXTickerResponse {
    symbol: gmoFXSymbol;
    ask: string;
    bid: string;
    timestamp: string;
    status: gmoFXStatus;
}
export interface gmoFXKLine {
    openTime: string;
    open: string;
    high: string;
    low: string;
    close: string;
}
export interface gmoFXAssetsResponse {
    equity: string;
    availableAmount: string;
    balance: string;
    estimatedTradeFee: string;
    margin: string;
    marginRatio: string;
    positionLossGain: string;
    totalSwap: string;
    transferableAmount: string;
}
export interface gmoFXOrder {
    rootOrderId: number;
    orderId: number;
    clientOrderId?: string;
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    orderType: gmoFXOrderType;
    executionType: gmoFXOrderExecutionType;
    settleType: gmoFXSettleType;
    size: string;
    price?: string;
    status: gmoFXOrderStatus;
    cancelType?: gmoFXCancelType;
    expiry?: string;
    timestamp: string;
}
export interface gmoFXOrdersResponse {
    list: gmoFXOrder[];
}
export interface gmoFXActiveOrdersResponse {
    list: gmoFXOrder[];
}
export interface gmoFXExecution {
    amount: string;
    executionId: number;
    clientOrderId?: string;
    orderId: number;
    positionId: number;
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    settleType: gmoFXSettleType;
    size: string;
    price: string;
    lossGain: string;
    fee: string;
    settledSwap: string;
    timestamp: string;
}
export interface gmoFXExecutionsResponse {
    list: gmoFXExecution[];
}
export interface gmoFXOpenPosition {
    positionId: number;
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    size: string;
    orderedSize: string;
    price: string;
    lossGain: string;
    totalSwap: string;
    timestamp: string;
}
export interface gmoFXOpenPositionsResponse {
    list: gmoFXOpenPosition[];
}
export interface gmoFXPositionSummary {
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    averagePositionRate: string;
    positionLossGain: string;
    sumOrderedSize: string;
    sumPositionSize: string;
    sumTotalSwap: string;
}
export interface gmoFXPositionSummaryResponse {
    list: gmoFXPositionSummary[];
}
export interface gmoFXCancelSuccess {
    rootOrderId: number;
    clientOrderId?: string;
}
export interface gmoFXCancelOrdersResponse {
    success: gmoFXCancelSuccess[];
}
export interface gmoFXPublicStreamTickerResponse {
    symbol: gmoFXSymbol;
    ask: string;
    bid: string;
    timestamp: string;
    status: gmoFXStatus;
}
export interface gmoFXPrivateStreamBaseResponse {
    channel: gmoFXWebsocketPrivateChannel;
}
export interface gmoFXPrivateStreamExecutionResponse extends gmoFXPrivateStreamBaseResponse {
    amount: string;
    rootOrderId: number;
    orderId: number;
    clientOrderId?: string;
    executionId: number;
    symbol: gmoFXSymbol;
    settleType: gmoFXSettleType;
    orderType: gmoFXOrderType;
    executionType: gmoFXOrderExecutionType;
    side: gmoFXSide;
    executionPrice: string;
    executionSize: string;
    positionId: number;
    lossGain: string;
    settledSwap: string;
    fee: string;
    orderPrice?: string;
    orderExecutedSize: string;
    orderSize: string;
    msgType: gmoFXExecutionMsgType;
    orderTimestamp: string;
    executionTimestamp: string;
}
export interface gmoFXPrivateStreamOrderResponse extends gmoFXPrivateStreamBaseResponse {
    rootOrderId: number;
    orderId: number;
    clientOrderId?: string;
    symbol: gmoFXSymbol;
    settleType: gmoFXSettleType;
    orderType: gmoFXOrderType;
    executionType: gmoFXOrderExecutionType;
    side: gmoFXSide;
    orderStatus: gmoFXOrderStatus;
    cancelType?: gmoFXCancelType;
    orderTimestamp: string;
    orderPrice?: string;
    orderSize: string;
    expiry: string;
    msgType: gmoFXOrderMsgType;
}
export interface gmoFXPrivateStreamPositionResponse extends gmoFXPrivateStreamBaseResponse {
    positionId: number;
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    size: string;
    orderdSize: string;
    price: string;
    lossGain: string;
    timestamp: string;
    totalSwap: string;
    msgType: gmoFXPositionMsgType;
}
export interface gmoFXPrivateStreamPositionSummaryResponse extends gmoFXPrivateStreamBaseResponse {
    symbol: gmoFXSymbol;
    side: gmoFXSide;
    averagePositionRate: string;
    positionLossGain: string;
    sumOrderedSize: string;
    sumPositionSize: string;
    sumTotalSwap: string;
    timestamp: string;
    msgType: gmoFXPositionSummaryMsgType;
}

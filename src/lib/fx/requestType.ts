import {
  gmoFXExecutionType,
  gmoFXIfdExecutionType,
  gmoFXKLineInterval,
  gmoFXPriceType,
  gmoFXSide,
  gmoFXSymbol
} from './type';

// ---------------- Public ----------------

// GET /public/v1/klines
export interface GetFXKLinesRequest {
  symbol: gmoFXSymbol;
  priceType: gmoFXPriceType;
  interval: gmoFXKLineInterval;
  date: string; // interval が 1min〜12hour の場合は YYYYMMDD、1day以上の場合は YYYY
}

// ---------------- Private ----------------

// GET /private/v1/orders
// rootOrderId と orderId はどちらか1つのみ指定する。各最大10件。
export interface GetFXOrdersRequest {
  rootOrderId?: number | number[];
  orderId?: number | number[];
}

// GET /private/v1/activeOrders
export interface GetFXActiveOrdersRequest {
  symbol?: gmoFXSymbol;
  prevId?: number; // 指定した値より小さい注文IDを取得
  count?: number;  // 指定しない場合は100（最大値）
}

// GET /private/v1/executions
// orderId と executionId はどちらか1つのみ指定する。executionId は最大10件。
export interface GetFXExecutionsRequest {
  orderId?: number;
  executionId?: number | number[];
}

// GET /private/v1/latestExecutions
export interface GetFXLatestExecutionsRequest {
  symbol: gmoFXSymbol;
  count?: number;
}

// GET /private/v1/openPositions
export interface GetFXOpenPositionsRequest {
  symbol?: gmoFXSymbol;
  prevId?: number; // 指定した値より小さい建玉IDを取得
  count?: number;
}

// GET /private/v1/positionSummary
export interface GetFXPositionSummaryRequest {
  symbol?: gmoFXSymbol; // 指定しない場合は全銘柄
}

// POST /private/v1/speedOrder
export interface PostFXSpeedOrderRequest {
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  size: string;
  clientOrderId?: string;
  lowerBound?: string; // side: SELL の場合のみ
  upperBound?: string; // side: BUY の場合のみ
  isHedgeable?: boolean; // 両建て（デフォルト false）
}

// POST /private/v1/order
export interface PostFXOrderRequest {
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  size: string;
  executionType: gmoFXExecutionType;
  clientOrderId?: string;
  limitPrice?: string; // LIMIT OCO の場合は必須
  stopPrice?: string;  // STOP OCO の場合は必須
  lowerBound?: string; // MARKET かつ side: SELL の場合のみ
  upperBound?: string; // MARKET かつ side: BUY の場合のみ
}

// POST /private/v1/ifdOrder
export interface PostFXIfdOrderRequest {
  symbol: gmoFXSymbol;
  firstSide: gmoFXSide; // 2次注文は自動的に反対売買になる
  firstExecutionType: gmoFXIfdExecutionType;
  firstSize: string;
  firstPrice: string;
  secondExecutionType: gmoFXIfdExecutionType;
  secondSize: string;
  secondPrice: string;
  clientOrderId?: string;
}

// POST /private/v1/ifoOrder (IFDOCO)
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

// POST /private/v1/changeOrder
// orderId と clientOrderId はどちらか1つのみ指定する。
export interface PostFXChangeOrderRequest {
  price: string;
  orderId?: number;
  clientOrderId?: string;
}

// POST /private/v1/changeOcoOrder
// rootOrderId と clientOrderId はどちらか1つのみ、
// limitPrice と stopPrice は両方またはどちらか1つを指定する。
export interface PostFXChangeOcoOrderRequest {
  rootOrderId?: number;
  clientOrderId?: string;
  limitPrice?: string;
  stopPrice?: string;
}

// POST /private/v1/changeIfdOrder
// firstPrice と secondPrice は両方またはどちらか1つを指定する。
export interface PostFXChangeIfdOrderRequest {
  rootOrderId?: number;
  clientOrderId?: string;
  firstPrice?: string;
  secondPrice?: string;
}

// POST /private/v1/changeIfoOrder
// firstPrice secondLimitPrice secondStopPrice のうち1つ以上を指定する。
export interface PostFXChangeIfoOrderRequest {
  rootOrderId?: number;
  clientOrderId?: string;
  firstPrice?: string;
  secondLimitPrice?: string;
  secondStopPrice?: string;
}

// POST /private/v1/cancelOrders
// rootOrderIds と clientOrderIds はどちらか1つのみ指定する。各最大10件。
export interface PostFXCancelOrdersRequest {
  rootOrderIds?: number[];
  clientOrderIds?: string[];
}

// POST /private/v1/cancelBulkOrder
export interface PostFXCancelBulkOrderRequest {
  symbols: gmoFXSymbol[];
  side?: gmoFXSide;
  settleType?: 'OPEN' | 'CLOSE';
}

export interface FXSettlePositionType {
  positionId: number;
  size: string;
}

// POST /private/v1/closeOrder
// size と settlePosition はどちらか1つのみ指定する。settlePosition は最大10件。
export interface PostFXCloseOrderRequest {
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  executionType: gmoFXExecutionType;
  clientOrderId?: string;
  size?: string;
  settlePosition?: FXSettlePositionType[];
  limitPrice?: string; // LIMIT OCO の場合は必須
  stopPrice?: string;  // STOP OCO の場合は必須
  lowerBound?: string; // MARKET かつ side: SELL の場合のみ
  upperBound?: string; // MARKET かつ side: BUY の場合のみ
}

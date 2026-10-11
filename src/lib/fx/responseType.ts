import {
  gmoFXCancelType,
  gmoFXExecutionMsgType,
  gmoFXOrderExecutionType,
  gmoFXOrderMsgType,
  gmoFXOrderStatus,
  gmoFXOrderType,
  gmoFXPositionMsgType,
  gmoFXPositionSummaryMsgType,
  gmoFXSettleType,
  gmoFXSide,
  gmoFXStatus,
  gmoFXSymbol,
  gmoFXWebsocketPrivateChannel
} from './type';

// ---------------- Public ----------------

// 外国為替FXステータス
// GET /public/v1/status
export interface gmoFXStatusResponse {
  status: gmoFXStatus;
}

// 取引ルール
// GET /public/v1/symbols
export interface gmoFXSymbolResponse {
  symbol: gmoFXSymbol;
  minOpenOrderSize: string; // 新規最小注文数量
  maxOrderSize: string;     // 最大注文数量
  sizeStep: string;         // 注文数量の刻み
  tickSize: string;         // 注文価格の刻み
}

// 最新レート
// GET /public/v1/ticker
// 暗号資産と違い high / low / volume は返らず、銘柄ごとの status が付く。
export interface gmoFXTickerResponse {
  symbol: gmoFXSymbol;
  ask: string;
  bid: string;
  timestamp: string;
  status: gmoFXStatus;
}

// KLine
// GET /public/v1/klines
// 暗号資産と違い volume は返らない。
export interface gmoFXKLine {
  openTime: string; // UNIX時間（ミリ秒）の文字列
  open: string;
  high: string;
  low: string;
  close: string;
}

// ---------------- Private ----------------

// 資産残高
// GET /private/v1/account/assets
// dataは要素1つの配列で返る。
export interface gmoFXAssetsResponse {
  equity: string;             // 時価評価総額
  availableAmount: string;    // 取引余力
  balance: string;            // 現金残高
  estimatedTradeFee: string;  // 見込み手数料
  margin: string;             // 拘束証拠金
  marginRatio: string;        // 証拠金維持率
  positionLossGain: string;   // 評価損益
  totalSwap: string;          // 未決済スワップ
  transferableAmount: string; // 振替余力
}

// 注文情報
// 注文系API（order / closeOrder / changeOrder など）はこの型の配列をdataに返す。
export interface gmoFXOrder {
  rootOrderId: number;
  orderId: number;
  clientOrderId?: string; // 設定した場合のみ返る
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  orderType: gmoFXOrderType;
  executionType: gmoFXOrderExecutionType;
  settleType: gmoFXSettleType;
  size: string;
  price?: string; // LIMIT STOP の場合のみ返る
  status: gmoFXOrderStatus;
  cancelType?: gmoFXCancelType; // CANCELED EXPIRED の場合のみ返る
  expiry?: string; // スピード注文では返らない
  timestamp: string;
}

// GET /private/v1/orders
export interface gmoFXOrdersResponse {
  list: gmoFXOrder[];
}

// GET /private/v1/activeOrders
export interface gmoFXActiveOrdersResponse {
  list: gmoFXOrder[];
}

// 約定情報
export interface gmoFXExecution {
  amount: string; // 受渡金額
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

// GET /private/v1/executions, GET /private/v1/latestExecutions
export interface gmoFXExecutionsResponse {
  list: gmoFXExecution[];
}

// 建玉
export interface gmoFXOpenPosition {
  positionId: number;
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  size: string;
  orderedSize: string; // 注文中数量（暗号資産の orderdSize とは綴りが違う）
  price: string;
  lossGain: string;
  totalSwap: string;
  timestamp: string;
}

// GET /private/v1/openPositions
export interface gmoFXOpenPositionsResponse {
  list: gmoFXOpenPosition[];
}

// 建玉サマリー
export interface gmoFXPositionSummary {
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  averagePositionRate: string;
  positionLossGain: string;
  sumOrderedSize: string;
  sumPositionSize: string;
  sumTotalSwap: string;
}

// GET /private/v1/positionSummary
export interface gmoFXPositionSummaryResponse {
  list: gmoFXPositionSummary[];
}

// 取消受付に成功した注文
export interface gmoFXCancelSuccess {
  rootOrderId: number;
  clientOrderId?: string;
}

// POST /private/v1/cancelOrders, POST /private/v1/cancelBulkOrder
export interface gmoFXCancelOrdersResponse {
  success: gmoFXCancelSuccess[];
}

// ---------------- WebSocket ----------------

// Public WebSocket の ticker
// 暗号資産と違い channel フィールドが付かない点に注意（実機で確認済み）。
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

// 約定情報通知
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
  orderPrice?: string; // LIMIT STOP の場合のみ返る
  orderExecutedSize: string;
  orderSize: string;
  msgType: gmoFXExecutionMsgType;
  orderTimestamp: string;
  executionTimestamp: string;
}

// 注文情報通知
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
  orderPrice?: string; // LIMIT STOP の場合のみ返る
  orderSize: string;
  expiry: string;
  msgType: gmoFXOrderMsgType;
}

// ポジション情報通知
export interface gmoFXPrivateStreamPositionResponse extends gmoFXPrivateStreamBaseResponse {
  positionId: number;
  symbol: gmoFXSymbol;
  side: gmoFXSide;
  size: string;
  orderdSize: string; // 建玉一覧の orderedSize とは綴りが違う（APIの仕様どおり）
  price: string;
  lossGain: string;
  timestamp: string;
  totalSwap: string;
  msgType: gmoFXPositionMsgType;
}

// ポジションサマリー情報通知
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

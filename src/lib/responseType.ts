import { gmoStatus, MarginCallStatus } from './type';

// root
export interface gmoResponse<T> {
  status: number;
  data: T;
  responsetime: string;
}

// status
export interface gmoStatusResponse {
  status: gmoStatus
}

// Ticker
export interface gmoTickerResponse {
  ask: string;
  bid: string;
  high: string;
  low: string;
  symbol: string;
  timestamp: string;
  volume: string;
}

// Orderbook
export interface OrderbookResponse {
  price: string;
  size: string;
}

// Orderbooks
export interface OrderbooksResponse {
  asks: OrderbookResponse[];
  bids: OrderbookResponse[];
}

// Trade
export interface TradeResponse {
  price: string;
  size: string;
  timestamp: string;
}

// Trades
export interface TradesResponse {
  pagination: {
    currentPage: number;
    count: number;
  }
  list: TradeResponse[];
}

export interface KLine {
  openTime: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}

// 余力情報を取得
// 余力情報を取得します。
// GET /private/v1/account/margin
export interface GetMarginResponse {
  actualProfitLoss: string
  availableAmount: string
  margin: string
  marginCallStatus: MarginCallStatus
  marginRatio: string
  profitLoss: string
}

// 資産残高を取得
// 資産残高を取得します。
// GET /private/v1/account/assets
export interface GetAssetsResponse {
  amount: string //残高
  available:	string //利用可能金額（残高 - 出金予定額）
  conversionRate: string //円転レート（販売所での売却価格です。※販売所で取り扱いのない銘柄は、取引所現物での最終約定価格です。）
  symbol:	string //資産残高銘柄
}

export interface TodayLimitSize {
  symbol: string //取扱銘柄はこちら
  todayLimitOpenSize: string //1日の最大取引数量の残量(新規) ※レバレッジ銘柄の場合のみ
  todayLimitBuySize: string //1日の最大取引数量の残量(購入) ※現物銘柄の場合のみ
  todayLimitSellSize: string //1日の最大取引数量の残量(売却) ※現物銘柄の場合のみ
}

// 取引高情報を取得
// 取引高情報を取得します
// GET /private/v1/account/tradingVolume
export interface GetTradingVolumeResponse {
  jpyVolume: string //今週の取引高(日本円)
  tierLevel: number //現在の取引高レベル: 1 2
  limit: TodayLimitSize[]
}

// ActiveOrdersResponse
export interface ActiveOrderResponse {
  rootOrderId: number;
  orderId: number;
  symbol: string;
  side: string;
  orderType: string;
  executionType: string;
  settleType: string;
  size: string;
  executedSize: string;
  price: string;
  losscutPrice: string;
  status: string;
  timeInForce: string;
  timestamp: string;
}

export interface ActiveOrdersResponse {
  pagination: {
    currentPage: number;
    count: number;
  }
  list: ActiveOrderResponse[];
}

export interface OpenPosition {
  positionId: number //建玉ID
  symbol: string //レバレッジ取扱銘柄はこちら
  side: string //売買区分: BUY SELL
  size: string //建玉数量
  orderdSize: string //発注中数量
  price: string //建玉レート
  lossGain: string //評価損益
  leverage: string //レバレッジ
  losscutPrice: string //ロスカットレート
  timestamp: string //約定日時
}

export interface PositionSummaryResponse {
  list: PositionSummary[]
}

export interface PositionSummary {
  averagePositionRate: string //平均建玉レート
  positionLossGain: string //評価損益
  side: string //売買区分: BUY SELL
  sumOrderQuantity: string //発注中数量
  sumPositionQuantity: string //建玉数量
  symbol: string //レバレッジ取扱銘柄はこちら
}

export interface OpenPositionsResponse {
  pagination: {
    currentPage: number;
    count: number;
  }
  list: OpenPosition[];
}

export interface gmoStreamBaseResponse{
  channel: string;
  symbol: string
}
export interface gmoPublicStreamBaseResponse extends gmoStreamBaseResponse{
  timestamp: string
}

export interface gmoPublicStreamTickerResponse extends gmoPublicStreamBaseResponse{
  ask: string;
  bid: string;
  high: string;
  last: string;
  low: string;
}

export interface gmoPublicStreamOrderBooksResponse extends gmoPublicStreamBaseResponse{
  asks: OrderbookResponse[];
  bids: OrderbookResponse[]
}

export interface gmoPublicStreamTradesResponse extends gmoPublicStreamBaseResponse{
  price: string;
  side:	string;	//売買区分: BUY SELL
  size:	string	//約定数量
}

export interface gmoPrivateStreamExecutionResponse extends gmoStreamBaseResponse{
  orderId: number;
  executionId: number;
  settleType: string;
  executionType: string;
  side: string;
  executionPrice: string;
  executionSize: string;
  positionId: number;
  orderTimestamp: string;
  executionTimestamp: string;
  lossGain: string;
  fee: string;
  orderPrice: string;
  orderSize: string;
  orderExecutedSize: string;
  timeInForce: string;
  msgType: string;
}

export interface gmoPrivateStreamOrderResponse extends gmoStreamBaseResponse {
  orderId: number;
  settleType: string;
  executionType: string;
  side: string;
  orderStatus: string;
  cancelType: string;
  orderTimestamp: string;
  orderPrice: string;
  orderSize: string;
  orderExecutedSize: string;
  losscutPrice: string;
  timeInForce: string;
  msgType: string;
}

export interface gmoPrivateStreamPositionResponse extends gmoStreamBaseResponse {
  positionId: number;
  side: string;
  size: string;
  orderdSize: string;
  price: string;
  lossGain: string;
  leverage: string;
  losscutPrice: string;
  timestamp: string;
  msgType: string;
}

export interface gmoPrivateStreamPositionSummaryResponse extends gmoStreamBaseResponse {
  side: string;
  averagePositionRate: string;
  positionLossGain: string;
  sumOrderQuantity: string;
  sumPositionQuantity: string;
  timestamp: string;
  msgType: string;
}

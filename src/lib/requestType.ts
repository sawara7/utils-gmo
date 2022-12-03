// Ticker
export interface GetTickerRequest {
  symbol?: string;
}

// Orderbooks
export interface GetOrderbooksRequest {
  symbol: string;
}

// Trades
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
  size: string;
}

export interface PostCloseOrderRequest extends BasePostOrderRequest {
  settlePosition: SettlePositionType
}

export interface PostCloseBulkOrderRequest extends BasePostOrderRequest{
  size: string;
}

export interface CancelOrderRequest {
  orderId: number;
}

export interface CancelBulkOrderRequest {
  symbols: string[]	
  side?: string	//string	Optional	BUY SELL 指定時のみ、指定された売買区分の注文を取消対象にします。
  settleType?: string //Optional	OPEN CLOSE 指定時のみ、現物取引注文と指定された決済区分のレバレッジ取引注文を取消対象にします。
  desc?: boolean
}

export interface GetActiveOrderRequest {
  symbol: string;
  page: number;
  count: number;
}

export interface GetKLinesRequest {
  symbol: string;
  interval: string;
  date: string;
}
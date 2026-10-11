export const GMO_API_NAME = 'gmo';

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

export const MarginCallStatusList = [
  "DEFAULT",	//Trigger an Order the “natural” way: compare its price to the ask for long Orders and bid for short Orders.
  "INVERSE",	//Trigger an Order the opposite of the “natural” way: compare its price the bid for long Orders and ask for short Orders.
  "BID",	//Trigger an Order by comparing its price to the bid regardless of whether it is long or short.
  "ASK",	//Trigger an Order by comparing its price to the ask regardless of whether it is long or short.
  "MID"	//Trigger an Order by comparing its price to the midpoint regardless of whether it is long or short.
] as const;
export type MarginCallStatus = typeof MarginCallStatusList[number];

// 取引所ステータス（REOPENという値はAPIに存在しないため修正）
export type gmoStatus = 'MAINTENANCE' | 'PREOPEN' | 'OPEN';
export type gmoWebsocketCommand = 'subscribe' | 'unsubscribe';
export const gmoWebsocketPublicChannels = [
  'ticker',
  'trades',
  'orderbooks'
] as const;
export type gmoWebsocketPublicChannel = typeof gmoWebsocketPublicChannels[number];

export const gmoWebsocketPrivateChannels = [
  'executionEvents',
  'orderEvents',
  'positionEvents',
  'positionSummaryEvents'
] as const;
export type gmoWebsocketPrivateChannel = typeof gmoWebsocketPrivateChannels[number];

// 取扱銘柄（GET /public/v1/symbols の内容に合わせる）
// 現物
export const gmoSpotPairs = [
  'BTC',
  'ETH',
  'BCH',
  'LTC',
  'XRP',
  'XLM',
  'DOT',
  'ATOM',
  'FCR',
  'ADA',
  'LINK',
  'DOGE',
  'SOL',
  'ASTR',
  'NAC',
  'WILD',
  'SUI'
] as const;
export type gmoSpotPair = typeof gmoSpotPairs[number];

// レバレッジ
export const gmoLeveragePairs = [
  'BTC_JPY',
  'ETH_JPY',
  'BCH_JPY',
  'LTC_JPY',
  'XRP_JPY',
  'DOT_JPY',
  'ATOM_JPY',
  'ADA_JPY',
  'LINK_JPY',
  'DOGE_JPY',
  'SOL_JPY',
  'SUI_JPY'
] as const;
export type gmoLeveragePair = typeof gmoLeveragePairs[number];

export const gmoPairs = [
  ...gmoSpotPairs,
  ...gmoLeveragePairs
] as const;
export type gmoPair = typeof gmoPairs[number];


// tradesチャンネルのみ指定可能。指定するとTakerのデータのみ配信される。
export type gmoTradesOption = 'TAKER_ONLY';

// positionSummaryEventsチャンネルのみ指定可能。指定すると5秒ごとに配信される。
export type gmoPositionSummaryOption = 'PERIODIC';

// 約定情報通知のメッセージタイプ
export type gmoExecutionMsgType = 'ER';
// 注文情報通知のメッセージタイプ: 新規 / 変更 / 取消 / 約定
export type gmoOrderMsgType = 'NOR' | 'ROR' | 'COR' | 'ER';
// ポジション情報通知のメッセージタイプ: 新規 / 更新 / ロスカット / 削除
export type gmoPositionMsgType = 'OPR' | 'UPR' | 'ULR' | 'CPR';
// ポジションサマリー情報通知のメッセージタイプ
export type gmoPositionSummaryMsgType = 'INIT' | 'UPDATE' | 'PERIODIC';

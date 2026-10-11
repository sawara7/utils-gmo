export const GMO_FX_API_NAME = 'gmofx';

export const gmoFXSymbols = [
  'USD_JPY',
  'EUR_JPY',
  'GBP_JPY',
  'AUD_JPY',
  'NZD_JPY',
  'CAD_JPY',
  'CHF_JPY',
  'TRY_JPY',
  'ZAR_JPY',
  'MXN_JPY',
  'HUF_JPY',
  'SEK_JPY',
  'EUR_USD',
  'GBP_USD',
  'AUD_USD',
  'NZD_USD',
  'EUR_GBP',
  'AUD_NZD',
  'AUD_CAD',
  'NZD_CAD',
  'NOK_SEK'
] as const;
export type gmoFXSymbol = typeof gmoFXSymbols[number];

// 全体の稼働状態および銘柄ごとの取引状態
// OPEN: 取引可能 / CLOSE: 取引不可（週末・メンテナンス前後） / MAINTENANCE: メンテナンス中
export type gmoFXStatus = 'OPEN' | 'CLOSE' | 'MAINTENANCE';

// KLine取得時の価格種別
export type gmoFXPriceType = 'BID' | 'ASK';

export const gmoFXKLineIntervals = [
  '1min',
  '5min',
  '10min',
  '15min',
  '30min',
  '1hour',
  '4hour',
  '8hour',
  '12hour',
  '1day',
  '1week',
  '1month'
] as const;
export type gmoFXKLineInterval = typeof gmoFXKLineIntervals[number];

// 売買区分
export type gmoFXSide = 'BUY' | 'SELL';

// 注文時に指定する注文タイプ
export type gmoFXExecutionType = 'MARKET' | 'LIMIT' | 'STOP' | 'OCO';

// IFD・IFDOCO注文の1次/2次注文で指定する注文タイプ
export type gmoFXIfdExecutionType = 'LIMIT' | 'STOP';

// レスポンスで返る注文タイプ（OCOは2本の注文に分かれて返るため含まれない）
export type gmoFXOrderExecutionType = 'MARKET' | 'LIMIT' | 'STOP';

// 取引区分
export type gmoFXOrderType = 'NORMAL' | 'OCO' | 'IFD' | 'IFDOCO' | 'LOSSCUT';

// 決済区分
export type gmoFXSettleType = 'OPEN' | 'CLOSE' | 'LOSS_CUT';

// 注文ステータス
export type gmoFXOrderStatus =
  | 'WAITING'
  | 'ORDERED'
  | 'MODIFYING'
  | 'CANCELED'
  | 'EXECUTED'
  | 'EXPIRED';

// 取消区分（statusが CANCELED または EXPIRED の場合のみ返る）
export type gmoFXCancelType =
  | 'USER'
  | 'INSUFFICIENT_COLLATERAL'
  | 'INSUFFICIENT_MARGIN'
  | 'SPEED'
  | 'OCO'
  | 'EXPIRATION'
  | 'PRICE_BOUND'
  | 'OUT_OF_SLIPPAGE_RANGE';

export type gmoFXWebsocketCommand = 'subscribe' | 'unsubscribe';

export const gmoFXWebsocketPublicChannels = [
  'ticker'
] as const;
export type gmoFXWebsocketPublicChannel = typeof gmoFXWebsocketPublicChannels[number];

export const gmoFXWebsocketPrivateChannels = [
  'executionEvents',
  'orderEvents',
  'positionEvents',
  'positionSummaryEvents'
] as const;
export type gmoFXWebsocketPrivateChannel = typeof gmoFXWebsocketPrivateChannels[number];

// positionSummaryEvents のみ指定可能。指定すると5秒ごとに配信される。
export type gmoFXPositionSummaryOption = 'PERIODIC';

// 約定情報通知のメッセージタイプ
export type gmoFXExecutionMsgType = 'ER';
// 注文情報通知のメッセージタイプ: 新規 / 変更 / 取消
export type gmoFXOrderMsgType = 'NOR' | 'ROR' | 'COR';
// ポジション情報通知のメッセージタイプ: 新規 / 更新 / 削除
export type gmoFXPositionMsgType = 'OPR' | 'UPR' | 'CPR';
// ポジションサマリー情報通知のメッセージタイプ
export type gmoFXPositionSummaryMsgType = 'INIT' | 'UPDATE' | 'PERIODIC';

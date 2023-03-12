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

export type gmoStatus = 'MAINTENANCE' | 'REOPEN' | 'OPEN';
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

export const gmoPairs = [
  'BTC',
  'ETH',
  'BCH',
  'LTC',
  'XRP',
  'BTC_JPY',
  'ETH_JPY',
  'BCH_JPY',
  'LTC_JPY',
  'XRP_JPY'
] as const;
export type gmoPair = typeof gmoPairs[number];


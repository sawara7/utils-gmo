export const GMO_API_NAME = 'gmo';

export interface ApiConfig {
  endPoint?: string;
  keepAlive?: boolean;
  timeout?: number;
}

export interface GMOApiConfig extends ApiConfig {
  apiKey: string;
  apiSecret: string;
  debug?: boolean;
}

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


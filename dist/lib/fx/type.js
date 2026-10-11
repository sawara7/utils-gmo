"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoFXWebsocketPrivateChannels = exports.gmoFXWebsocketPublicChannels = exports.gmoFXKLineIntervals = exports.gmoFXSymbols = exports.GMO_FX_API_NAME = void 0;
exports.GMO_FX_API_NAME = 'gmofx';
exports.gmoFXSymbols = [
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
];
exports.gmoFXKLineIntervals = [
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
];
exports.gmoFXWebsocketPublicChannels = [
    'ticker'
];
exports.gmoFXWebsocketPrivateChannels = [
    'executionEvents',
    'orderEvents',
    'positionEvents',
    'positionSummaryEvents'
];

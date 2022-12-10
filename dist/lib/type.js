"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoPairs = exports.gmoWebsocketPrivateChannels = exports.gmoWebsocketPublicChannels = exports.MarginCallStatusList = exports.GMO_API_NAME = void 0;
exports.GMO_API_NAME = 'gmo';
exports.MarginCallStatusList = [
    "DEFAULT",
    "INVERSE",
    "BID",
    "ASK",
    "MID" //Trigger an Order by comparing its price to the midpoint regardless of whether it is long or short.
];
exports.gmoWebsocketPublicChannels = [
    'ticker',
    'trades',
    'orderbooks'
];
exports.gmoWebsocketPrivateChannels = [
    'executionEvents',
    'orderEvents',
    'positionEvents',
    'positionSummaryEvents'
];
exports.gmoPairs = [
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
];

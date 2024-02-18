"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoPairs = exports.gmoWebsocketPrivateChannels = exports.gmoWebsocketPublicChannels = exports.MarginCallStatusList = exports.GMO_API_NAME = void 0;
exports.GMO_API_NAME = 'gmo';
exports.MarginCallStatusList = [
    "DEFAULT", //Trigger an Order the “natural” way: compare its price to the ask for long Orders and bid for short Orders.
    "INVERSE", //Trigger an Order the opposite of the “natural” way: compare its price the bid for long Orders and ask for short Orders.
    "BID", //Trigger an Order by comparing its price to the bid regardless of whether it is long or short.
    "ASK", //Trigger an Order by comparing its price to the ask regardless of whether it is long or short.
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

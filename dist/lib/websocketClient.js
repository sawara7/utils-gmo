"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketAPIClient = void 0;
const utils_general_1 = require("utils-general");
const private_stream_1 = require("./private-stream");
const public_stream_1 = require("./public-stream");
class WebsocketAPIClient {
    constructor(params) {
        this.isError = false;
        this.subscribeOrder = true;
        this.onPrivateStreamOpen = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.isError = false;
            yield (0, utils_general_1.sleep)(1000);
            if (!this.isError) {
                if (this.subscribeOrder) {
                    (_a = this.privateStream) === null || _a === void 0 ? void 0 : _a.subscribe("executionEvents");
                    (_b = this.privateStream) === null || _b === void 0 ? void 0 : _b.subscribe("orderEvents");
                }
                if (this.onClientStart) {
                    this.onClientStart();
                }
            }
            else {
                if (this.onClientError) {
                    this.onClientError();
                }
            }
        });
        this.onPrivateStreamClose = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.onPrivateStreamError = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.onPublicStreamOpen = () => __awaiter(this, void 0, void 0, function* () {
            var _c;
            for (const m of this.tickerSymbols) {
                (_c = this.publicStream) === null || _c === void 0 ? void 0 : _c.subscribe('ticker', m);
            }
        });
        this.onPublicStreamClose = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.onPublicStreamError = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.onFill = (fill) => {
            if (this.onClientOrder) {
                const o = {
                    id: fill.orderId,
                    market: fill.symbol,
                    type: fill.executionType.toLowerCase(),
                    side: fill.side.toLowerCase(),
                    size: parseFloat(fill.orderSize),
                    price: parseFloat(fill.orderPrice),
                    reduceOnly: fill.settleType === 'CLOSE',
                    ioc: false,
                    postOnly: fill.timeInForce === 'SOK',
                    status: parseFloat(fill.orderSize) - parseFloat(fill.orderExecutedSize) < 0.00001 ? 'closed' : 'open',
                    filledSize: parseFloat(fill.orderExecutedSize),
                    remainingSize: parseFloat(fill.orderSize) - parseFloat(fill.orderExecutedSize),
                    avgFillPrice: parseFloat(fill.executionPrice),
                    fee: parseFloat(fill.fee)
                };
                this.onClientOrder(o);
            }
        };
        this.onOrder = (order) => {
            if (this.onClientOrder) {
                const o = {
                    id: order.orderId,
                    market: order.symbol,
                    type: order.executionType.toLowerCase(),
                    side: order.side.toLowerCase(),
                    size: parseFloat(order.orderSize),
                    price: parseFloat(order.orderPrice),
                    reduceOnly: order.settleType === 'CLOSE',
                    ioc: false,
                    postOnly: order.timeInForce === 'SOK',
                    status: order.orderStatus,
                    filledSize: parseFloat(order.orderExecutedSize),
                    remainingSize: parseFloat(order.orderSize) - parseFloat(order.orderExecutedSize),
                    avgFillPrice: parseFloat(order.orderPrice),
                    fee: 0
                };
                this.onClientOrder(o);
            }
        };
        this.onTicker = (ticker) => {
            if (this.onClientTicker) {
                const t = {
                    time: ticker.timestamp,
                    bid: parseFloat(ticker.bid),
                    ask: parseFloat(ticker.ask),
                    last: parseFloat(ticker.last)
                };
                this.onClientTicker(t);
            }
        };
        this.subscribeOrder = params.subscribeOrder;
        this.tickerSymbols = params.tickerSymbols;
        this.account = params.account;
        this.apiKey = params.apiSettings.apiKey;
        this.apiSecret = params.apiSettings.apiSecret;
        this.onClientStart = params.onClientStart;
        this.onClientError = params.onClientError;
        this.onClientOrder = params.onClientOrder;
        this.onClientTicker = params.onClientTicker;
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.privateStream = new private_stream_1.gmoPrivateStreamAPIClass(this.apiKey, this.apiSecret, {
                reconnect: true,
                execution: this.onFill,
                order: this.onOrder,
                // position?: gmoPrivateStreamPositionCallback
                // summary?: gmoPrivateStreamSummaryCallback
                onWebSocketOpen: this.onPrivateStreamOpen,
                onWebSocketClose: this.onPrivateStreamClose,
                onWebSocketError: this.onPrivateStreamError
            });
            this.publicStream = new public_stream_1.gmoPublicStreamClass({
                reconnect: true,
                ticker: this.onTicker,
                // orderbooks?: gmoPublicStreamOrderBooksCallback
                // trades?: gmoPublicStreamTradesCallback
                onWebSocketOpen: this.onPublicStreamOpen,
                onWebSocketClose: this.onPublicStreamClose,
                onWebSocketError: this.onPublicStreamError
            });
        });
    }
}
exports.WebsocketAPIClient = WebsocketAPIClient;

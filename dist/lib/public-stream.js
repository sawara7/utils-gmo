"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoPublicStreamClass = void 0;
const ws_1 = __importDefault(require("ws"));
const PATH = "wss://api.coin.z.com/ws/public/v1";
class gmoPublicStreamClass {
    //
    constructor(option) {
        this.reconnect = true;
        this.ws = null;
        this.onPing = () => {
            var _a;
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.pong();
        };
        this.onOpen = () => {
            if (this.onWebSocketOpen) {
                this.onWebSocketOpen();
            }
        };
        this.onClose = () => {
            if (this.reconnect) {
                this.initialize();
            }
            if (this.onWebSocketClose) {
                this.onWebSocketClose();
            }
        };
        this.onError = () => {
            if (this.onWebSocketError) {
                this.onWebSocketError();
            }
        };
        this.onMessage = (data) => {
            const res = JSON.parse(data.toString());
            if (res.channel === 'ticker') {
                if (this.ticker) {
                    this.ticker(res);
                }
            }
            else if (res.channel === 'orderbooks') {
                if (this.orderbooks) {
                    this.orderbooks(res);
                }
            }
            else if (res.channel === 'trades') {
                if (this.trades) {
                    this.trades(res);
                }
            }
        };
        this.reconnect = option.reconnect;
        this.ticker = option.ticker;
        this.orderbooks = option.orderbooks;
        this.trades = option.trades;
        this.onWebSocketOpen = option.onWebSocketOpen;
        this.onWebSocketClose = option.onWebSocketClose;
        this.onWebSocketError = option.onWebSocketError;
        this.initialize();
    }
    initialize() {
        this.ws = new ws_1.default(PATH);
        this.ws.on("open", this.onOpen);
        this.ws.on("close", this.onClose);
        this.ws.on("error", this.onError);
        this.ws.on("ping", this.onPing);
        this.ws.on("message", this.onMessage);
    }
    subscribe(channel, pair) {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            "command": "subscribe",
            "channel": channel,
            "symbol": pair
        }));
    }
}
exports.gmoPublicStreamClass = gmoPublicStreamClass;

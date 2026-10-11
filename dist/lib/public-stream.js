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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoPublicStreamClass = exports.dispatchPublicStreamMessage = void 0;
const ws_1 = __importDefault(require("ws"));
const utils_general_1 = require("utils-general");
const PATH = "wss://api.coin.z.com/ws/public/v1";
// 同一IPからの subscribe / unsubscribe は1秒1回が上限。
const SUBSCRIBE_INTERVAL = 1000;
// 受信メッセージの振り分け。テストしやすいようにクラスから切り出している。
// 対応するチャンネルを処理した場合に true を返す。
function dispatchPublicStreamMessage(message, callbacks) {
    const res = JSON.parse(message);
    if (res.channel === 'ticker') {
        if (callbacks.ticker) {
            callbacks.ticker(res);
        }
        return true;
    }
    else if (res.channel === 'orderbooks') {
        if (callbacks.orderbooks) {
            callbacks.orderbooks(res);
        }
        return true;
    }
    else if (res.channel === 'trades') {
        if (callbacks.trades) {
            callbacks.trades(res);
        }
        return true;
    }
    return false;
}
exports.dispatchPublicStreamMessage = dispatchPublicStreamMessage;
class gmoPublicStreamClass {
    //
    constructor(option) {
        this.reconnect = true;
        this.ws = null;
        // internal
        this.sendQueue = Promise.resolve();
        this.lastSendTime = 0;
        // サーバーから1分に1回pingが来る。3回連続で応答しないと切断される。
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
            dispatchPublicStreamMessage(data.toString(), this.callbacks);
        };
        this.reconnect = option.reconnect;
        this.callbacks = {
            ticker: option.ticker,
            orderbooks: option.orderbooks,
            trades: option.trades
        };
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
    // 再接続を止めて接続を終了する。
    close() {
        var _a;
        this.reconnect = false;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
    }
    // option: 'TAKER_ONLY' は trades チャンネルのみ指定可能。
    subscribe(channel, pair, option) {
        const message = {
            "command": "subscribe",
            "channel": channel,
            "symbol": pair
        };
        if (option) {
            Object.assign(message, { "option": option });
        }
        return this.send(message);
    }
    unsubscribe(channel, pair) {
        return this.send({
            "command": "unsubscribe",
            "channel": channel,
            "symbol": pair
        });
    }
    // 1秒1回の制限を守るため、送信を直列化して間隔を空ける。
    send(message) {
        this.sendQueue = this.sendQueue.then(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const wait = SUBSCRIBE_INTERVAL - (Date.now() - this.lastSendTime);
            if (wait > 0) {
                yield (0, utils_general_1.sleep)(wait);
            }
            this.lastSendTime = Date.now();
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message));
        }));
        return this.sendQueue;
    }
}
exports.gmoPublicStreamClass = gmoPublicStreamClass;

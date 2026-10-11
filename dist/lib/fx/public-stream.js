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
exports.gmoFXPublicStreamClass = exports.dispatchFXPublicStreamMessage = void 0;
const ws_1 = __importDefault(require("ws"));
const utils_general_1 = require("utils-general");
const PATH = 'wss://forex-api.coin.z.com/ws/public/v1';
// 同一IPからの subscribe / unsubscribe は1秒1回が上限。
const SUBSCRIBE_INTERVAL = 1000;
// 受信メッセージの振り分け。テストしやすいようにクラスから切り出している。
// 外国為替FXのtickerは暗号資産と違い channel を返さないため、
// bid / ask を持つメッセージを ticker として扱う。
// 対応するメッセージを処理した場合に true を返す。
function dispatchFXPublicStreamMessage(message, callbacks) {
    const res = JSON.parse(message);
    if (res.bid !== undefined && res.ask !== undefined) {
        if (callbacks.ticker) {
            callbacks.ticker(res);
        }
        return true;
    }
    return false;
}
exports.dispatchFXPublicStreamMessage = dispatchFXPublicStreamMessage;
class gmoFXPublicStreamClass {
    //
    constructor(option) {
        this.reconnect = true;
        this.ws = null;
        // internal
        this.sendQueue = Promise.resolve();
        this.lastSendTime = 0;
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
            dispatchFXPublicStreamMessage(data.toString(), this.callbacks);
        };
        this.reconnect = option.reconnect;
        this.callbacks = { ticker: option.ticker };
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
    subscribe(channel, symbol) {
        return this.send({
            "command": "subscribe",
            "channel": channel,
            "symbol": symbol
        });
    }
    unsubscribe(channel, symbol) {
        return this.send({
            "command": "unsubscribe",
            "channel": channel,
            "symbol": symbol
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
exports.gmoFXPublicStreamClass = gmoFXPublicStreamClass;

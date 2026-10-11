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
exports.gmoPrivateStreamAPIClass = exports.dispatchPrivateStreamMessage = void 0;
const ws_1 = __importDefault(require("ws"));
const utils_general_1 = require("utils-general");
const private_api_1 = require("./private-api");
const PATH = "wss://api.coin.z.com/ws/private/v1/";
// 同一IPからの subscribe / unsubscribe は1秒1回が上限。
const SUBSCRIBE_INTERVAL = 1000;
// アクセストークンの有効期限は60分。切れる前に延長する。
const TOKEN_UPDATE_INTERVAL = 30 * 60 * 1000;
// 受信メッセージの振り分け。テストしやすいようにクラスから切り出している。
// 対応するチャンネルを処理した場合に true を返す。
function dispatchPrivateStreamMessage(message, callbacks) {
    const res = JSON.parse(message);
    if (res.channel === 'executionEvents') {
        if (callbacks.execution) {
            callbacks.execution(res);
        }
        return true;
    }
    else if (res.channel === 'orderEvents') {
        if (callbacks.order) {
            callbacks.order(res);
        }
        return true;
    }
    else if (res.channel === 'positionEvents') {
        if (callbacks.position) {
            callbacks.position(res);
        }
        return true;
    }
    else if (res.channel === 'positionSummaryEvents') {
        if (callbacks.summary) {
            callbacks.summary(res);
        }
        return true;
    }
    return false;
}
exports.dispatchPrivateStreamMessage = dispatchPrivateStreamMessage;
class gmoPrivateStreamAPIClass {
    constructor(apiKey, apiSecret, option) {
        this.reconnect = true;
        this.ws = null;
        this.token = '';
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
            dispatchPrivateStreamMessage(data.toString(), this.callbacks);
        };
        this.api = new private_api_1.gmoPrivateApiClass({
            apiKey: apiKey,
            apiSecret: apiSecret
        });
        this.reconnect = option.reconnect;
        this.executionCallback = option.execution;
        this.orderCallback = option.order;
        this.positionCallback = option.position;
        this.summaryCallback = option.summary;
        this.callbacks = {
            execution: (res) => { if (this.executionCallback) {
                this.executionCallback(res);
            } },
            order: (res) => { if (this.orderCallback) {
                this.orderCallback(res);
            } },
            position: (res) => { if (this.positionCallback) {
                this.positionCallback(res);
            } },
            summary: (res) => { if (this.summaryCallback) {
                this.summaryCallback(res);
            } }
        };
        this.onWebSocketOpen = option.onWebSocketOpen;
        this.onWebSocketClose = option.onWebSocketClose;
        this.onWebSocketError = option.onWebSocketError;
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.intervalID) {
                clearInterval(this.intervalID);
                this.intervalID = undefined;
            }
            const res = yield this.api.getWebsocketAccessToken();
            if (!res || !res.data) {
                throw 'Websocket access token not created.';
            }
            this.token = res.data;
            this.intervalID = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield this.api.updateWebsocketAccessToken(this.token);
            }), TOKEN_UPDATE_INTERVAL);
            this.ws = new ws_1.default(PATH + this.token);
            this.ws.on("open", this.onOpen);
            this.ws.on("close", this.onClose);
            this.ws.on("error", this.onError);
            this.ws.on("ping", this.onPing);
            this.ws.on("message", this.onMessage);
        });
    }
    // アクセストークンを削除して接続を終了する。
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.reconnect = false;
            if (this.intervalID) {
                clearInterval(this.intervalID);
                this.intervalID = undefined;
            }
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
            if (this.token) {
                yield this.api.deleteWebsocketAccessToken(this.token);
                this.token = '';
            }
        });
    }
    // option: 'PERIODIC' は positionSummaryEvents のみ指定可能（5秒ごとに配信）。
    subscribe(channel, option) {
        const message = {
            "command": "subscribe",
            "channel": channel
        };
        if (option) {
            Object.assign(message, { "option": option });
        }
        return this.send(message);
    }
    unsubscribe(channel) {
        return this.send({
            "command": "unsubscribe",
            "channel": channel
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
exports.gmoPrivateStreamAPIClass = gmoPrivateStreamAPIClass;

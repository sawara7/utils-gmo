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
exports.gmoPrivateStreamAPIClass = void 0;
const ws_1 = __importDefault(require("ws"));
const private_api_1 = require("./private-api");
const PATH = "wss://api.coin.z.com/ws/private/v1/";
class gmoPrivateStreamAPIClass {
    constructor(apiKey, apiSecret, option) {
        this.reconnect = true;
        this.ws = null;
        this.token = '';
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
            if (res.channel === 'executionEvents') {
                if (this.executionCallback) {
                    this.executionCallback(res);
                }
                ;
            }
            else if (res.channel === 'orderEvents') {
                if (this.orderCallback) {
                    this.orderCallback(res);
                }
                ;
            }
            else if (res.channel === 'positionEvents') {
                if (this.positionCallback) {
                    this.positionCallback(res);
                }
                ;
            }
            else if (res.channel === 'positionSummary') {
                if (this.summaryCallback) {
                    this.summaryCallback(res);
                }
                ;
            }
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
            }), 30 * 60 * 1000);
            this.ws = new ws_1.default(PATH + this.token);
            this.ws.on("open", this.onOpen);
            this.ws.on("close", this.onClose);
            this.ws.on("error", this.onError);
            this.ws.on("ping", this.onPing);
            this.ws.on("message", this.onMessage);
        });
    }
    subscribe(channel) {
        if (this.ws) {
            this.ws.send(JSON.stringify({
                "command": "subscribe",
                "channel": channel,
            }));
        }
    }
}
exports.gmoPrivateStreamAPIClass = gmoPrivateStreamAPIClass;

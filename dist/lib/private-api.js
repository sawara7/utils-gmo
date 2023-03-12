"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoPrivateApiClass = void 0;
const crypto = __importStar(require("crypto"));
const api_1 = require("./api");
const URL_API_GMO = 'https://api.coin.z.com/private';
class gmoPrivateApiClass extends api_1.baseApiClass {
    constructor(config, options) {
        config.endPoint = config.endPoint || URL_API_GMO;
        super(config, options);
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        this.debug = config.debug ? true : false;
    }
    getWebsocketAccessToken() {
        const path = '/v1/ws-auth';
        return this.post(path, {});
    }
    updateWebsocketAccessToken(request) {
        const path = '/v1/ws-auth';
        return this.put(path, { token: request });
    }
    // GET /private/v1/account/assets
    getMargin() {
        const path = '/v1/account/margin';
        return this.get(path);
    }
    // GET /private/v1/account/assets
    getAssets() {
        const path = '/v1/account/assets';
        return this.get(path);
    }
    // GET /private/v1/account/tradingVolume
    getTradingVolume() {
        const path = '/v1/account/tradingVolume';
        return this.get(path);
    }
    postOrder(request) {
        const path = '/v1/order';
        return this.post(path, request);
    }
    postCloseOrder(request) {
        const path = '/v1/closeOrder';
        return this.post(path, request);
    }
    postCloseBulkOrder(request) {
        const path = '/v1/closeBulkOrder';
        return this.post(path, request);
    }
    cancelOrder(request) {
        const path = '/v1/cancelOrder';
        return this.post(path, request);
    }
    cancelBulkOrder(request) {
        const path = '/v1/cancelBulkOrder';
        return this.post(path, request);
    }
    getActiveOrders(request) {
        const path = '/v1/activeOrders';
        return this.get(path, request);
    }
    getOpenPositions(request) {
        const path = '/v1/openPositions';
        return this.get(path, request);
    }
    getExecution(request) {
        const path = '/v1/executions';
        return this.get(path, request);
    }
    getPositionSummary(symbol) {
        const path = '/v1/positionSummary';
        const request = {};
        if (symbol) {
            Object.assign(request, symbol);
        }
        return this.get(path, request);
    }
    get(path, query) {
        // let params = '';
        // if (query && Object.keys(query).length) {
        //   params += '?' + querystring.stringify(query);
        // }
        // const p = path + params
        const headers = this.makeHeader('GET', path, '');
        if (this.debug) {
            console.log('GET');
            console.log(path);
            console.log(headers);
        }
        return super.get(path, query, headers);
    }
    post(path, query) {
        const data = JSON.stringify(query);
        const headers = this.makeHeader('POST', path, data);
        if (this.debug) {
            console.log('POST');
            console.log(path);
            console.log(headers);
            console.log(data);
        }
        return super.post(path, query, headers);
    }
    put(path, query) {
        // const data = JSON.stringify(query);
        const headers = this.makeHeader('PUT', path, '');
        if (this.debug) {
            console.log('PUT');
            console.log(path);
            console.log(headers);
            console.log(query);
        }
        return super.put(path, query, headers);
    }
    makeHeader(method, path, body) {
        const timestamp = Date.now().toString();
        const text = timestamp + method + path + body;
        const sign = crypto.createHmac('sha256', this.apiSecret).update(text).digest('hex');
        return {
            "API-KEY": this.apiKey,
            "API-TIMESTAMP": timestamp,
            "API-SIGN": sign
        };
    }
}
exports.gmoPrivateApiClass = gmoPrivateApiClass;

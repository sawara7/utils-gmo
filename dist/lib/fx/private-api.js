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
exports.gmoFXPrivateApiClass = void 0;
const crypto = __importStar(require("crypto"));
const api_1 = require("../api");
const URL_API_GMO_FX = 'https://forex-api.coin.z.com/private';
// APIは配列パラメータをカンマ区切りの文字列で受け取るため、
// axiosの配列展開（a[]=1&a[]=2）を避けて自前で文字列化する。
function toQuery(request) {
    const query = {};
    if (!request) {
        return query;
    }
    for (const [key, value] of Object.entries(request)) {
        if (value === undefined || value === null) {
            continue;
        }
        query[key] = Array.isArray(value) ? value.join(',') : String(value);
    }
    return query;
}
class gmoFXPrivateApiClass extends api_1.baseApiClass {
    constructor(config, options) {
        config.endPoint = config.endPoint || URL_API_GMO_FX;
        super(config, options);
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        this.debug = config.debug ? true : false;
    }
    // ---------------- 資産 ----------------
    // GET /private/v1/account/assets
    // dataは要素1つの配列で返る。
    getAssets() {
        const path = '/v1/account/assets';
        return this.get(path);
    }
    // ---------------- 注文・約定・建玉の参照 ----------------
    // GET /private/v1/orders
    getOrders(request) {
        const path = '/v1/orders';
        return this.get(path, toQuery(request));
    }
    // GET /private/v1/activeOrders
    getActiveOrders(request) {
        const path = '/v1/activeOrders';
        return this.get(path, toQuery(request));
    }
    // GET /private/v1/executions
    getExecutions(request) {
        const path = '/v1/executions';
        return this.get(path, toQuery(request));
    }
    // GET /private/v1/latestExecutions
    getLatestExecutions(request) {
        const path = '/v1/latestExecutions';
        return this.get(path, toQuery(request));
    }
    // GET /private/v1/openPositions
    getOpenPositions(request) {
        const path = '/v1/openPositions';
        return this.get(path, toQuery(request));
    }
    // GET /private/v1/positionSummary
    getPositionSummary(request) {
        const path = '/v1/positionSummary';
        return this.get(path, toQuery(request));
    }
    // ---------------- 発注 ----------------
    // POST /private/v1/speedOrder
    postSpeedOrder(request) {
        const path = '/v1/speedOrder';
        return this.post(path, request);
    }
    // POST /private/v1/order
    postOrder(request) {
        const path = '/v1/order';
        return this.post(path, request);
    }
    // POST /private/v1/ifdOrder
    postIfdOrder(request) {
        const path = '/v1/ifdOrder';
        return this.post(path, request);
    }
    // POST /private/v1/ifoOrder (IFDOCO)
    postIfoOrder(request) {
        const path = '/v1/ifoOrder';
        return this.post(path, request);
    }
    // POST /private/v1/closeOrder
    postCloseOrder(request) {
        const path = '/v1/closeOrder';
        return this.post(path, request);
    }
    // ---------------- 注文変更・取消 ----------------
    // POST /private/v1/changeOrder
    changeOrder(request) {
        const path = '/v1/changeOrder';
        return this.post(path, request);
    }
    // POST /private/v1/changeOcoOrder
    changeOcoOrder(request) {
        const path = '/v1/changeOcoOrder';
        return this.post(path, request);
    }
    // POST /private/v1/changeIfdOrder
    changeIfdOrder(request) {
        const path = '/v1/changeIfdOrder';
        return this.post(path, request);
    }
    // POST /private/v1/changeIfoOrder
    changeIfoOrder(request) {
        const path = '/v1/changeIfoOrder';
        return this.post(path, request);
    }
    // POST /private/v1/cancelOrders
    cancelOrders(request) {
        const path = '/v1/cancelOrders';
        return this.post(path, request);
    }
    // POST /private/v1/cancelBulkOrder
    cancelBulkOrder(request) {
        const path = '/v1/cancelBulkOrder';
        return this.post(path, request);
    }
    // ---------------- Private WebSocket用アクセストークン ----------------
    // POST /private/v1/ws-auth
    // 有効期限60分。最大5個まで発行できる。
    getWebsocketAccessToken() {
        const path = '/v1/ws-auth';
        return this.post(path, {});
    }
    // PUT /private/v1/ws-auth
    // 残り期限に関わらず有効期限を60分に延長する。
    updateWebsocketAccessToken(token) {
        const path = '/v1/ws-auth';
        return this.put(path, { token: token });
    }
    // DELETE /private/v1/ws-auth
    deleteWebsocketAccessToken(token) {
        const path = '/v1/ws-auth';
        return this.delete(path, { token: token });
    }
    // ---------------- 署名付きリクエスト ----------------
    get(path, query) {
        // 署名対象のパスはクエリ文字列を含まない。GETのリクエストボディは空文字列。
        const headers = this.makeHeader('GET', path, '');
        if (this.debug) {
            console.log('GET', path, headers, query);
        }
        return super.get(path, query, headers);
    }
    post(path, data) {
        const body = JSON.stringify(data);
        const headers = this.makeHeader('POST', path, body);
        if (this.debug) {
            console.log('POST', path, headers, body);
        }
        return super.post(path, data, headers);
    }
    // PUT と DELETE はボディを送るが署名には含めない。
    // ドキュメントの文章では「ボディを連結する」と書かれているが、
    // 公式サンプル（ws-auth の PUT / DELETE）は timestamp + method + path だけで署名している。
    // 暗号資産側のサンプルも同じなので、サンプルに合わせる。
    // ERR-5010（署名不正）が出るようになった場合はここを body 付きに変える。
    put(path, data) {
        const headers = this.makeHeader('PUT', path, '');
        if (this.debug) {
            console.log('PUT', path, headers, data);
        }
        return super.put(path, data, headers);
    }
    delete(path, data) {
        const headers = this.makeHeader('DELETE', path, '');
        if (this.debug) {
            console.log('DELETE', path, headers, data);
        }
        return this.request('DELETE', path, undefined, data, headers);
    }
    makeHeader(method, path, body) {
        const timestamp = Date.now().toString();
        const text = timestamp + method + path + body;
        const sign = crypto.createHmac('sha256', this.apiSecret).update(text).digest('hex');
        return {
            'API-KEY': this.apiKey,
            'API-TIMESTAMP': timestamp,
            'API-SIGN': sign
        };
    }
}
exports.gmoFXPrivateApiClass = gmoFXPrivateApiClass;

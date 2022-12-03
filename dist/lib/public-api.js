"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmoPublicApiClass = void 0;
const api_1 = require("./api");
const URL_API_GMO = 'https://api.coin.z.com/public/v1';
class gmoPublicApiClass extends api_1.baseApiClass {
    constructor(config, options) {
        config.endPoint = config.endPoint || URL_API_GMO;
        super(config, options);
    }
    getStatus() {
        const path = '/status';
        return this.get(path);
    }
    getTicker(params) {
        const path = '/ticker';
        return this.get(path, params || {});
    }
    getOrderbooks(params) {
        const path = '/orderbooks';
        return this.get(path, params);
    }
    getTrades(params) {
        const path = '/trades';
        return this.get(path, params);
    }
    getKLines(params) {
        const path = '/klines';
        return this.get(path, params);
    }
}
exports.gmoPublicApiClass = gmoPublicApiClass;

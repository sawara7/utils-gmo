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
exports.gmoFXPublicApiClass = void 0;
const api_1 = require("../api");
const URL_API_GMO_FX = 'https://forex-api.coin.z.com/public/v1';
class gmoFXPublicApiClass extends api_1.baseApiClass {
    constructor(config = {}, options) {
        config.endPoint = config.endPoint || URL_API_GMO_FX;
        super(config, options);
    }
    // GET /public/v1/status
    getStatus() {
        const path = '/status';
        return this.get(path);
    }
    // GET /public/v1/symbols
    getSymbols() {
        const path = '/symbols';
        return this.get(path);
    }
    // GET /public/v1/ticker
    // 外国為替FXのtickerは銘柄指定ができないため、常に全銘柄が返る。
    getTicker() {
        const path = '/ticker';
        return this.get(path);
    }
    // 全銘柄のtickerから1銘柄だけ取り出す。
    getTickerBySymbol(symbol) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getTicker();
            const ticker = (_a = res.data) === null || _a === void 0 ? void 0 : _a.find((t) => t.symbol === symbol);
            if (!ticker) {
                throw new api_1.ApiError(res.status, 'Ticker not found. symbol: ' + symbol, res);
            }
            return ticker;
        });
    }
    // GET /public/v1/klines
    getKLines(params) {
        const path = '/klines';
        return this.get(path, params);
    }
}
exports.gmoFXPublicApiClass = gmoFXPublicApiClass;

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
exports.GMOPositionClass = void 0;
const trade_utils_1 = require("trade-utils");
class GMOPositionClass extends trade_utils_1.BasePositionClass {
    constructor(params) {
        super(params);
        this._api = params.api;
    }
    placeOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._backtestMode) {
                //
            }
            if (order.isClose) {
                return yield this._api.postCloseOrder(order.CloseOrderRequest);
            }
            else {
                return yield this._api.postOrder(order.OpenOrderRequest);
            }
        });
    }
    doOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.placeOrder(this.openOrder);
            if (res.status !== 0) {
                throw new Error('[Place Order Error]' + res.status);
            }
            return res.data;
        });
    }
    doClose() {
        return __awaiter(this, void 0, void 0, function* () {
            const s = this.state.isLosscut ? "losscut" : "close";
            const res = yield this.placeOrder(s === "close" ? this.closeOrder : this.losscutOrder);
            if (res.status !== 0) {
                throw new Error('[Place Order Error]' + res.status);
            }
            return res.data;
        });
    }
    doCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.orderID) {
                yield this._api.cancelOrder({
                    orderId: parseInt(this.state.orderID)
                });
            }
        });
    }
    get openOrder() {
        return super.openOrder;
    }
    get closeOrder() {
        return super.closeOrder;
    }
    get losscutOrder() {
        return super.losscutOrder;
    }
}
exports.GMOPositionClass = GMOPositionClass;

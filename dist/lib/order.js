"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMOOrderClass = void 0;
const trade_utils_1 = require("trade-utils");
class GMOOrderClass extends trade_utils_1.BaseOrderClass {
    constructor(params) {
        super(params);
        this._reduceOnly = params.reduceOnly || false;
        this._positionID = params.positionID || 0;
        this._isClose = params.isClose;
    }
    get OpenOrderRequest() {
        return {
            symbol: this.market.name,
            side: this.side,
            price: this.type === 'limit' ? this.price.toString() : undefined,
            executionType: this.type,
            timeInForce: this._reduceOnly ? 'SOK' : 'FAK',
            size: this.size.toString(),
            // reduceOnly: this._reduceOnly,
            // ioc: this._ioc,
            // postOnly: this.postOnly,
            // timeInForce?: string,
            // price?: string,
            // losscutPrice?: string
        };
    }
    get CloseOrderRequest() {
        return {
            symbol: this.market.name,
            side: this.side,
            price: this.type === 'limit' ? this.price.toString() : undefined,
            executionType: this.type,
            timeInForce: this._reduceOnly ? 'SOK' : 'FAK',
            settlePosition: {
                positionId: this._positionID,
                size: this.size.toString()
            }
            // reduceOnly: this._reduceOnly,
            // ioc: this._ioc,
            // postOnly: this.postOnly,
            // timeInForce?: string,
            // price?: string,
            // losscutPrice?: string
        };
    }
    get isClose() {
        return this._isClose;
    }
}
exports.GMOOrderClass = GMOOrderClass;

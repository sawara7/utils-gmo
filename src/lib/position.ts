import {
    BasePositionClass,
    BasePositionParameters
} from "utils-trade"

import {
    gmoPrivateApiClass,
    gmoResponse,
    GMOOrderClass
} from ".."

export interface GMOPositionParameters extends BasePositionParameters {
    api: gmoPrivateApiClass
}

export class GMOPositionClass extends BasePositionClass {
    // Parameters
    private _api: gmoPrivateApiClass

    constructor(params: GMOPositionParameters){
        super(params)
        this._api = params.api
    }

    private async placeOrder(order: GMOOrderClass): Promise<gmoResponse<string>> {
        if (this._backtestMode) {
//
        }
        if (order.isClose) {
            return await this._api.postCloseOrder(order.CloseOrderRequest)
        } else {
            return await this._api.postOrder(order.OpenOrderRequest)
        }
    }

    public async doOpen() {
        const res = await this.placeOrder(this.openOrder)
        if (res.status !== 0) {
            throw new Error('[Place Order Error]' + res.status)
        }
        return res.data
    }
    
    public async doClose() {
        const s = this.state.isLosscut? "losscut": "close"
        const res = await this.placeOrder( s === "close"? this.closeOrder: this.losscutOrder )
        if (res.status !== 0) {
            throw new Error('[Place Order Error]' + res.status)
        }
        return res.data
    }

    public async doCancel() {
        if (this.state.orderID) {
            await this._api.cancelOrder({
                orderId: parseInt(this.state.orderID)
            })
        }
    }

    get openOrder(): GMOOrderClass {
        return super.openOrder as GMOOrderClass
    }
    
    get closeOrder(): GMOOrderClass {
        return super.closeOrder as GMOOrderClass
    }

    get losscutOrder(): GMOOrderClass {
        return super.losscutOrder as GMOOrderClass
    }
}
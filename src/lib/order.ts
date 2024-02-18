import {
    BaseOrderSettings,
    BaseOrderClass
} from "utils-trade"

import {
    PostOrderRequest,
    PostCloseOrderRequest
} from ".."

export interface GMOOrderSettings extends BaseOrderSettings {
    positionID: number
    reduceOnly?: boolean
    isClose: boolean
}

export class GMOOrderClass extends BaseOrderClass {
    private _positionID: number
    private _reduceOnly: boolean
    private _isClose: boolean

    constructor (params: GMOOrderSettings) {
        super(params)
        this._reduceOnly = params.reduceOnly || false
        this._positionID = params.positionID || 0
        this._isClose = params.isClose
    }

    get OpenOrderRequest(): PostOrderRequest {
        return {
            symbol:	this.market.name,
            side: this.side, 
            price: this.type === 'limit'? this.price.toString(): undefined,
            executionType: this.type,
            timeInForce: this._reduceOnly? 'SOK' : 'FAK',
            size: this.size.toString(),	
            // reduceOnly: this._reduceOnly,
            // ioc: this._ioc,
            // postOnly: this.postOnly,
            // timeInForce?: string,
            // price?: string,
            // losscutPrice?: string
        }
    }

    get CloseOrderRequest(): PostCloseOrderRequest {
        return {
            symbol:	this.market.name,
            side: this.side, 
            price: this.type === 'limit'? this.price.toString(): undefined,
            executionType: this.type,
            timeInForce: this._reduceOnly? 'SOK' : 'FAK',
            settlePosition: [{
                positionId: this._positionID,
                size: this.size.toString()
            }]
            // reduceOnly: this._reduceOnly,
            // ioc: this._ioc,
            // postOnly: this.postOnly,
            // timeInForce?: string,
            // price?: string,
            // losscutPrice?: string
        }
    }

    get isClose(): boolean {
        return this._isClose
    }
}
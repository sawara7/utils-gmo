import { BaseOrderSettings, BaseOrderClass } from "utils-trade";
import { PostOrderRequest, PostCloseOrderRequest } from "..";
export interface GMOOrderSettings extends BaseOrderSettings {
    positionID: number;
    reduceOnly?: boolean;
    isClose: boolean;
}
export declare class GMOOrderClass extends BaseOrderClass {
    private _positionID;
    private _reduceOnly;
    private _isClose;
    constructor(params: GMOOrderSettings);
    get OpenOrderRequest(): PostOrderRequest;
    get CloseOrderRequest(): PostCloseOrderRequest;
    get isClose(): boolean;
}

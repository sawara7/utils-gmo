import { BasePositionClass, BasePositionParameters } from "trade-utils";
import { gmoPrivateApiClass, GMOOrderClass } from "..";
export interface GMOPositionParameters extends BasePositionParameters {
    api: gmoPrivateApiClass;
}
export declare class GMOPositionClass extends BasePositionClass {
    private _api;
    constructor(params: GMOPositionParameters);
    private placeOrder;
    doOpen(): Promise<string>;
    doClose(): Promise<string>;
    doCancel(): Promise<void>;
    get openOrder(): GMOOrderClass;
    get closeOrder(): GMOOrderClass;
    get losscutOrder(): GMOOrderClass;
}

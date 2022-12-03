import { baseApiClass, ApiOptions } from './api';
import { ApiConfig } from './type';
import { GetTickerRequest, GetOrderbooksRequest, GetTradesRequest, GetKLinesRequest } from './requestType';
import { gmoResponse, gmoStatusResponse, gmoTickerResponse, KLine, OrderbooksResponse, TradesResponse } from './responseType';
export declare class gmoPublicApiClass extends baseApiClass {
    constructor(config: ApiConfig, options?: ApiOptions);
    getStatus(): Promise<gmoResponse<gmoStatusResponse>>;
    getTicker(params?: GetTickerRequest): Promise<gmoResponse<gmoTickerResponse[]>>;
    getOrderbooks(params: GetOrderbooksRequest): Promise<gmoResponse<OrderbooksResponse>>;
    getTrades(params: GetTradesRequest): Promise<gmoResponse<TradesResponse>>;
    getKLines(params: GetKLinesRequest): Promise<gmoResponse<KLine[]>>;
}

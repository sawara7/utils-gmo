import { baseApiClass, ApiOptions } from '../api';
import { ApiConfig } from '../type';
import { gmoResponse } from '../responseType';
import { GetFXKLinesRequest } from './requestType';
import { gmoFXKLine, gmoFXStatusResponse, gmoFXSymbolResponse, gmoFXTickerResponse } from './responseType';
import { gmoFXSymbol } from './type';
export declare class gmoFXPublicApiClass extends baseApiClass {
    constructor(config?: ApiConfig, options?: ApiOptions);
    getStatus(): Promise<gmoResponse<gmoFXStatusResponse>>;
    getSymbols(): Promise<gmoResponse<gmoFXSymbolResponse[]>>;
    getTicker(): Promise<gmoResponse<gmoFXTickerResponse[]>>;
    getTickerBySymbol(symbol: gmoFXSymbol): Promise<gmoFXTickerResponse>;
    getKLines(params: GetFXKLinesRequest): Promise<gmoResponse<gmoFXKLine[]>>;
}

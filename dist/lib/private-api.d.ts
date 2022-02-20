import { baseApiClass, ApiOptions } from './api';
import { GMOApiConfig } from './type';
import { gmoResponse, MarginResponse } from './responseType';
import { CancelOrderRequest, GetActiveOrderRequest, PostCloseOrderRequest, PostCloseBulkOrderRequest, PostOrderRequest, CancelBulkOrderRequest } from './requestType';
import { ActiveOrdersResponse } from './responseType';
export declare class gmoPrivateApiClass extends baseApiClass {
    private readonly apiKey;
    private readonly apiSecret;
    constructor(config: GMOApiConfig, options?: ApiOptions);
    getWebsocketAccessToken(): Promise<gmoResponse<string>>;
    updateWebsocketAccessToken(request: string): Promise<gmoResponse<void>>;
    getMargin(): Promise<gmoResponse<MarginResponse>>;
    postOrder(request: PostOrderRequest): Promise<gmoResponse<string>>;
    postCloseOrder(request: PostCloseOrderRequest): Promise<gmoResponse<string>>;
    postCloseBulkOrder(request: PostCloseBulkOrderRequest): Promise<gmoResponse<string>>;
    cancelOrder(request: CancelOrderRequest): Promise<gmoResponse<void>>;
    cancelBulkOrder(request: CancelBulkOrderRequest): Promise<gmoResponse<number[]>>;
    getActiveOrders(request: GetActiveOrderRequest): Promise<gmoResponse<ActiveOrdersResponse>>;
    get<T>(path: string, query?: {}): Promise<any>;
    post<T>(path: string, query: {}): Promise<any>;
    put<T>(path: string, query: {}): Promise<any>;
    private makeHeader;
}

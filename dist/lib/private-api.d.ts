import { baseApiClass, ApiOptions } from './api';
import { GMOApiConfig } from './type';
import { GetAssetsResponse, gmoResponse, GetMarginResponse, OpenPositionsResponse, PositionSummaryResponse, GetTradingVolumeResponse, gmoExecutionResponseList } from './responseType';
import { CancelOrderRequest, GetActiveOrderRequest, PostCloseOrderRequest, PostCloseBulkOrderRequest, PostOrderRequest, CancelBulkOrderRequest, GetOpenPositionsRequest, GetExecutionRequest } from './requestType';
import { ActiveOrdersResponse } from './responseType';
export declare class gmoPrivateApiClass extends baseApiClass {
    private readonly apiKey;
    private readonly apiSecret;
    private readonly debug;
    constructor(config: GMOApiConfig, options?: ApiOptions);
    getWebsocketAccessToken(): Promise<gmoResponse<string>>;
    updateWebsocketAccessToken(request: string): Promise<gmoResponse<void>>;
    getMargin(): Promise<gmoResponse<GetMarginResponse>>;
    getAssets(): Promise<gmoResponse<GetAssetsResponse>>;
    getTradingVolume(): Promise<gmoResponse<GetTradingVolumeResponse>>;
    postOrder(request: PostOrderRequest): Promise<gmoResponse<string>>;
    postCloseOrder(request: PostCloseOrderRequest): Promise<gmoResponse<string>>;
    postCloseBulkOrder(request: PostCloseBulkOrderRequest): Promise<gmoResponse<string>>;
    cancelOrder(request: CancelOrderRequest): Promise<gmoResponse<void>>;
    cancelBulkOrder(request: CancelBulkOrderRequest): Promise<gmoResponse<number[]>>;
    getActiveOrders(request: GetActiveOrderRequest): Promise<gmoResponse<ActiveOrdersResponse>>;
    getOpenPositions(request: GetOpenPositionsRequest): Promise<gmoResponse<OpenPositionsResponse>>;
    getExecution(request: GetExecutionRequest): Promise<gmoResponse<gmoExecutionResponseList>>;
    getPositionSummary(symbol?: string): Promise<gmoResponse<PositionSummaryResponse>>;
    get<T>(path: string, query?: {}): Promise<any>;
    post<T>(path: string, query: {}): Promise<any>;
    put<T>(path: string, query: {}): Promise<any>;
    private makeHeader;
}

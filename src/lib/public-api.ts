import {
  baseApiClass,
  ApiOptions
} from './api';
import {
  ApiConfig
} from './type';
import {
  GetTickerRequest,
  GetOrderbooksRequest,
  GetTradesRequest
} from './requestType';
import {
  gmoResponse,
  gmoStatusResponse,
  gmoTickerResponse,
  OrderbooksResponse,
  TradesResponse
} from './responseType';

const URL_API_GMO = 'https://api.coin.z.com/public/v1';

export class gmoPublicApiClass extends baseApiClass {
  constructor(config: ApiConfig, options?: ApiOptions) {
    config.endPoint = config.endPoint || URL_API_GMO;
    super(config, options);
  }

  public getStatus(): Promise<gmoResponse<gmoStatusResponse>> {
    const path = '/status'
    return this.get(path);
  }
  
  public getTicker(params?: GetTickerRequest): Promise<gmoResponse<gmoTickerResponse[]>> {
    const path: string = '/ticker';
    return this.get(path, params || {});
  }

  public getOrderbooks(params: GetOrderbooksRequest): Promise<gmoResponse<OrderbooksResponse>> {
    const path = '/orderbooks';
    return this.get(path, params);
  }

  public getTrades(params: GetTradesRequest): Promise<gmoResponse<TradesResponse>> {
    const path = '/trades';
    return this.get(path, params);
  }
}

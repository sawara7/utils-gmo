import {
  baseApiClass,
  ApiError,
  ApiOptions
} from '../api';
import {
  ApiConfig
} from '../type';
import {
  gmoResponse
} from '../responseType';
import {
  GetFXKLinesRequest
} from './requestType';
import {
  gmoFXKLine,
  gmoFXStatusResponse,
  gmoFXSymbolResponse,
  gmoFXTickerResponse
} from './responseType';
import {
  gmoFXSymbol
} from './type';

const URL_API_GMO_FX = 'https://forex-api.coin.z.com/public/v1';

export class gmoFXPublicApiClass extends baseApiClass {
  constructor(config: ApiConfig = {}, options?: ApiOptions) {
    config.endPoint = config.endPoint || URL_API_GMO_FX;
    super(config, options);
  }

  // GET /public/v1/status
  public getStatus(): Promise<gmoResponse<gmoFXStatusResponse>> {
    const path = '/status';
    return this.get(path);
  }

  // GET /public/v1/symbols
  public getSymbols(): Promise<gmoResponse<gmoFXSymbolResponse[]>> {
    const path = '/symbols';
    return this.get(path);
  }

  // GET /public/v1/ticker
  // 外国為替FXのtickerは銘柄指定ができないため、常に全銘柄が返る。
  public getTicker(): Promise<gmoResponse<gmoFXTickerResponse[]>> {
    const path = '/ticker';
    return this.get(path);
  }

  // 全銘柄のtickerから1銘柄だけ取り出す。
  public async getTickerBySymbol(symbol: gmoFXSymbol): Promise<gmoFXTickerResponse> {
    const res = await this.getTicker();
    const ticker = res.data?.find((t) => t.symbol === symbol);
    if (!ticker) {
      throw new ApiError(res.status, 'Ticker not found. symbol: ' + symbol, res);
    }
    return ticker;
  }

  // GET /public/v1/klines
  public getKLines(params: GetFXKLinesRequest): Promise<gmoResponse<gmoFXKLine[]>> {
    const path = '/klines';
    return this.get(path, params);
  }
}

import * as crypto from 'crypto';
import {
  baseApiClass,
  ApiOptions
} from '../api';
import {
  GMOApiConfig
} from '../type';
import {
  gmoResponse
} from '../responseType';
import {
  GetFXActiveOrdersRequest,
  GetFXExecutionsRequest,
  GetFXLatestExecutionsRequest,
  GetFXOpenPositionsRequest,
  GetFXOrdersRequest,
  GetFXPositionSummaryRequest,
  PostFXCancelBulkOrderRequest,
  PostFXCancelOrdersRequest,
  PostFXChangeIfdOrderRequest,
  PostFXChangeIfoOrderRequest,
  PostFXChangeOcoOrderRequest,
  PostFXChangeOrderRequest,
  PostFXCloseOrderRequest,
  PostFXIfdOrderRequest,
  PostFXIfoOrderRequest,
  PostFXOrderRequest,
  PostFXSpeedOrderRequest
} from './requestType';
import {
  gmoFXActiveOrdersResponse,
  gmoFXAssetsResponse,
  gmoFXCancelOrdersResponse,
  gmoFXExecutionsResponse,
  gmoFXOpenPositionsResponse,
  gmoFXOrder,
  gmoFXOrdersResponse,
  gmoFXPositionSummaryResponse
} from './responseType';

const URL_API_GMO_FX = 'https://forex-api.coin.z.com/private';

// APIは配列パラメータをカンマ区切りの文字列で受け取るため、
// axiosの配列展開（a[]=1&a[]=2）を避けて自前で文字列化する。
function toQuery(request?: {}): {} {
  const query: { [key: string]: string } = {};
  if (!request) { return query; }
  for (const [key, value] of Object.entries(request)) {
    if (value === undefined || value === null) { continue; }
    query[key] = Array.isArray(value) ? value.join(',') : String(value);
  }
  return query;
}

export class gmoFXPrivateApiClass extends baseApiClass {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly debug: boolean;

  constructor(config: GMOApiConfig, options?: ApiOptions) {
    config.endPoint = config.endPoint || URL_API_GMO_FX;
    super(config, options);
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.debug = config.debug ? true : false;
  }

  // ---------------- 資産 ----------------

  // GET /private/v1/account/assets
  // dataは要素1つの配列で返る。
  public getAssets(): Promise<gmoResponse<gmoFXAssetsResponse[]>> {
    const path = '/v1/account/assets';
    return this.get(path);
  }

  // ---------------- 注文・約定・建玉の参照 ----------------

  // GET /private/v1/orders
  public getOrders(request: GetFXOrdersRequest): Promise<gmoResponse<gmoFXOrdersResponse>> {
    const path = '/v1/orders';
    return this.get(path, toQuery(request));
  }

  // GET /private/v1/activeOrders
  public getActiveOrders(request?: GetFXActiveOrdersRequest): Promise<gmoResponse<gmoFXActiveOrdersResponse>> {
    const path = '/v1/activeOrders';
    return this.get(path, toQuery(request));
  }

  // GET /private/v1/executions
  public getExecutions(request: GetFXExecutionsRequest): Promise<gmoResponse<gmoFXExecutionsResponse>> {
    const path = '/v1/executions';
    return this.get(path, toQuery(request));
  }

  // GET /private/v1/latestExecutions
  public getLatestExecutions(request: GetFXLatestExecutionsRequest): Promise<gmoResponse<gmoFXExecutionsResponse>> {
    const path = '/v1/latestExecutions';
    return this.get(path, toQuery(request));
  }

  // GET /private/v1/openPositions
  public getOpenPositions(request?: GetFXOpenPositionsRequest): Promise<gmoResponse<gmoFXOpenPositionsResponse>> {
    const path = '/v1/openPositions';
    return this.get(path, toQuery(request));
  }

  // GET /private/v1/positionSummary
  public getPositionSummary(request?: GetFXPositionSummaryRequest): Promise<gmoResponse<gmoFXPositionSummaryResponse>> {
    const path = '/v1/positionSummary';
    return this.get(path, toQuery(request));
  }

  // ---------------- 発注 ----------------

  // POST /private/v1/speedOrder
  public postSpeedOrder(request: PostFXSpeedOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/speedOrder';
    return this.post(path, request);
  }

  // POST /private/v1/order
  public postOrder(request: PostFXOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/order';
    return this.post(path, request);
  }

  // POST /private/v1/ifdOrder
  public postIfdOrder(request: PostFXIfdOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/ifdOrder';
    return this.post(path, request);
  }

  // POST /private/v1/ifoOrder (IFDOCO)
  public postIfoOrder(request: PostFXIfoOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/ifoOrder';
    return this.post(path, request);
  }

  // POST /private/v1/closeOrder
  public postCloseOrder(request: PostFXCloseOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/closeOrder';
    return this.post(path, request);
  }

  // ---------------- 注文変更・取消 ----------------

  // POST /private/v1/changeOrder
  public changeOrder(request: PostFXChangeOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/changeOrder';
    return this.post(path, request);
  }

  // POST /private/v1/changeOcoOrder
  public changeOcoOrder(request: PostFXChangeOcoOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/changeOcoOrder';
    return this.post(path, request);
  }

  // POST /private/v1/changeIfdOrder
  public changeIfdOrder(request: PostFXChangeIfdOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/changeIfdOrder';
    return this.post(path, request);
  }

  // POST /private/v1/changeIfoOrder
  public changeIfoOrder(request: PostFXChangeIfoOrderRequest): Promise<gmoResponse<gmoFXOrder[]>> {
    const path = '/v1/changeIfoOrder';
    return this.post(path, request);
  }

  // POST /private/v1/cancelOrders
  public cancelOrders(request: PostFXCancelOrdersRequest): Promise<gmoResponse<gmoFXCancelOrdersResponse>> {
    const path = '/v1/cancelOrders';
    return this.post(path, request);
  }

  // POST /private/v1/cancelBulkOrder
  public cancelBulkOrder(request: PostFXCancelBulkOrderRequest): Promise<gmoResponse<gmoFXCancelOrdersResponse>> {
    const path = '/v1/cancelBulkOrder';
    return this.post(path, request);
  }

  // ---------------- Private WebSocket用アクセストークン ----------------

  // POST /private/v1/ws-auth
  // 有効期限60分。最大5個まで発行できる。
  public getWebsocketAccessToken(): Promise<gmoResponse<string>> {
    const path = '/v1/ws-auth';
    return this.post(path, {});
  }

  // PUT /private/v1/ws-auth
  // 残り期限に関わらず有効期限を60分に延長する。
  public updateWebsocketAccessToken(token: string): Promise<gmoResponse<void>> {
    const path = '/v1/ws-auth';
    return this.put(path, { token: token });
  }

  // DELETE /private/v1/ws-auth
  public deleteWebsocketAccessToken(token: string): Promise<gmoResponse<void>> {
    const path = '/v1/ws-auth';
    return this.delete(path, { token: token });
  }

  // ---------------- 署名付きリクエスト ----------------

  get(path: string, query?: {}) {
    // 署名対象のパスはクエリ文字列を含まない。GETのリクエストボディは空文字列。
    const headers = this.makeHeader('GET', path, '');
    if (this.debug) {
      console.log('GET', path, headers, query);
    }
    return super.get(path, query, headers);
  }

  post(path: string, data: {}) {
    const body = JSON.stringify(data);
    const headers = this.makeHeader('POST', path, body);
    if (this.debug) {
      console.log('POST', path, headers, body);
    }
    return super.post(path, data, headers);
  }

  // PUT と DELETE はボディを送るが署名には含めない。
  // ドキュメントの文章では「ボディを連結する」と書かれているが、
  // 公式サンプル（ws-auth の PUT / DELETE）は timestamp + method + path だけで署名している。
  // 暗号資産側のサンプルも同じなので、サンプルに合わせる。
  // ERR-5010（署名不正）が出るようになった場合はここを body 付きに変える。
  put(path: string, data: {}) {
    const headers = this.makeHeader('PUT', path, '');
    if (this.debug) {
      console.log('PUT', path, headers, data);
    }
    return super.put(path, data, headers);
  }

  delete(path: string, data: {}) {
    const headers = this.makeHeader('DELETE', path, '');
    if (this.debug) {
      console.log('DELETE', path, headers, data);
    }
    return this.request('DELETE', path, undefined, data, headers);
  }

  private makeHeader(method: string, path: string, body: string): any {
    const timestamp = Date.now().toString();
    const text = timestamp + method + path + body;
    const sign = crypto.createHmac('sha256', this.apiSecret).update(text).digest('hex');
    return {
      'API-KEY': this.apiKey,
      'API-TIMESTAMP': timestamp,
      'API-SIGN': sign
    };
  }
}

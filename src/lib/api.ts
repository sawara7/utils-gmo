import * as http from 'http';
import * as https from 'https';
import axios, { AxiosError, Method } from 'axios';
import { ApiConfig } from './type';
import { sleep } from 'my-utils'

export interface ApiOptions {
  optionsCallback?: Function;
  responseCallback?: Function;
}

export class ApiError extends Error {
  code: number = 0;
  message: string = '';
  data: any;
  constructor(code: number, message: string, data?: any){
    super('API_ERROR');
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export class baseApiClass {
  readonly endPoint: string;
  readonly keepAlive: boolean;
  readonly timeout: number;
  readonly optionsCallback?: Function;
  readonly responseCallback?: Function;
  private lastOrderTime: number = 0
  private sendingInterval: number
  private waitingCount: number = 0
  private maxWaiting: number

  constructor(config: ApiConfig, options?: ApiOptions) {
    this.endPoint = config.endPoint || "";
    this.keepAlive = config.keepAlive || false;
    this.timeout = config.timeout || 3000;
    if (options) {
      this.optionsCallback = options.optionsCallback;
      this.responseCallback = options.responseCallback;
    }
    this.sendingInterval = config.sendingInterval || 1000/6 // Default Tier.1
    if (this.lastOrderTime===0) this.lastOrderTime = Date.now()
    this.maxWaiting = config.maxWaiting || 100
  }

  async get(path: string, params?: {}, headers?: {}) {
    return this.request('GET', path, params, undefined, headers);
  }

  async post(path: string, data?: {}, headers?: {}) {
    return this.request('POST', path, undefined, data, headers);
  }

  async put(path: string, data?: {}, headers?: {}) {
    return this.request('PUT', path, undefined, data, headers);
  }

  async request(method: Method, path: string, params?: {}, data?: {}, headers?: {}) {
    await this.sleepWhileInterval()
    const options = {
      method: method,
      baseURL: this.endPoint,
      url: path,
      timeout: this.timeout,
      httpAgent: new http.Agent({ keepAlive: this.keepAlive }),
      httpsAgent: new https.Agent({ keepAlive: this.keepAlive }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (params && Object.keys(params).length > 0) {
      Object.assign(options, { params });
    }
    if (data && Object.keys(data).length >= 0) {
      Object.assign(options, { data });
    }
    if (headers && Object.keys(headers).length > 0) {
      Object.assign(options, { headers });
    }

    if (this.optionsCallback) {
      await this.optionsCallback(options);
    }

    try {
      const res = await axios.request(options);
      if (this.responseCallback) {
        this.responseCallback(res.data);
      }
      return res.data;
    }catch(e){
      const err = e as AxiosError;
      let code = 0;
      let message = err.message;
      let data;
      if (err.response) {
        code = err.response.status;
        data = err.response.data;
      }
      throw new ApiError(code, message, data);
    }
    // return axios.request(options).then((res) => {
    //   if (this.responseCallback) {
    //     this.responseCallback(res.data);
    //   }
    //   return res.data;
    // }).catch((e: AxiosError) => {
    //   let code = 0;
    //   let message = e.message;
    //   let data;
    //   if (e.response) {
    //     code = e.response.status;
    //     data = e.response.data;
    //   }
    //   throw new ApiError(code, message, data);
    // });
  }

  private async sleepWhileInterval(): Promise<void> {
    this.waitingCount++;
    try {
      if (this.waitingCount > this.maxWaiting) throw new Error('API max waiting.')
      const interval = Date.now() - this.lastOrderTime
      if (interval > 0) {
          if (interval < this.sendingInterval) {
            this.lastOrderTime += this.sendingInterval
            await sleep(this.sendingInterval - interval)
          } else if (interval > this.sendingInterval) {
            this.lastOrderTime = Date.now()
          }
      } else if (interval < 0) {
        this.lastOrderTime += this.sendingInterval
        await sleep(this.lastOrderTime - Date.now())
      }
      } finally {
        this.waitingCount--
    }
  }
}

import { Method } from 'axios';
import { ApiConfig } from './type';
export interface ApiOptions {
    optionsCallback?: Function;
    responseCallback?: Function;
}
export declare class ApiError extends Error {
    code: number;
    message: string;
    data: any;
    constructor(code: number, message: string, data?: any);
}
export declare class baseApiClass {
    readonly endPoint: string;
    readonly keepAlive: boolean;
    readonly timeout: number;
    readonly optionsCallback?: Function;
    readonly responseCallback?: Function;
    private lastOrderTime;
    private sendingInterval;
    private waitingCount;
    private maxWaiting;
    constructor(config: ApiConfig, options?: ApiOptions);
    get(path: string, params?: {}, headers?: {}): Promise<any>;
    post(path: string, data?: {}, headers?: {}): Promise<any>;
    put(path: string, data?: {}, headers?: {}): Promise<any>;
    request(method: Method, path: string, params?: {}, data?: {}, headers?: {}): Promise<any>;
    private sleepWhileInterval;
}

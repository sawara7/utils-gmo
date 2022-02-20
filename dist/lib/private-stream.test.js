"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const my_utils_1 = require("my-utils");
const private_stream_1 = require("./private-stream");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const label = 'LOCAL_TEST';
    const rdb = yield (0, my_utils_1.getRealTimeDatabase)();
    const apiKey = yield rdb.get(yield rdb.getReference('settings/gmo/accounts/' + label + '/apiKey'));
    const secret = yield rdb.get(yield rdb.getReference('settings/gmo/accounts/' + label + '/apiSecret'));
    const ws = new private_stream_1.gmoPrivateStreamAPIClass(apiKey, secret, {
        reconnect: true,
        execution: (data) => { console.log(data); },
        order: (data) => { console.log(data); },
        position: (data) => { console.log(data); },
        summary: (data) => { console.log(data); },
        onWebSocketOpen: () => {
            console.log('open');
            ws.subscribe('orderEvents');
            ws.subscribe('executionEvents');
        },
        onWebSocketClose: () => {
            console.log('close');
        },
        onWebSocketError: () => {
            console.log('error');
        },
    });
}))();

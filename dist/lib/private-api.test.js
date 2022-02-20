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
const __1 = require("..");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const api = yield (0, __1.getGMOPrivateAPI)('LOCAL_TEST');
    // for (let i = 0; i < 200; i++) {
    //     await sleep(300)
    //     await api.postOrder({
    //         symbol: 'XRP_JPY',
    //         side: 'SELL',
    //         size: '10',
    //         executionType: 'LIMIT',
    //         price: '100'
    //     })
    // }
    let res = (yield api.cancelBulkOrder({
        symbols: ['XRP_JPY'],
        side: 'SELL'
    }));
    console.log(res);
    while (res && res.data.length > 0) {
        yield (0, my_utils_1.sleep)(300);
        res = (yield api.cancelBulkOrder({
            symbols: ['XRP_JPY'],
            side: 'SELL'
        }));
        console.log(res);
    }
}))();

import { getRealTimeDatabase } from "my-utils";
import { gmoPrivateStreamAPIClass } from "./private-stream";

(async()=>{
    const label = 'LOCAL_TEST'
    const rdb = await getRealTimeDatabase()
    const apiKey = await rdb.get(await rdb.getReference('settings/gmo/accounts/' + label + '/apiKey')) as string
    const secret = await rdb.get(await rdb.getReference('settings/gmo/accounts/' + label + '/apiSecret')) as string
    const ws = new gmoPrivateStreamAPIClass(apiKey, secret, {
        reconnect: true,
        execution: (data) => {console.log(data)},
        order: (data) => {console.log(data)},
        position: (data) => {console.log(data)},
        summary: (data) => {console.log(data)},
        onWebSocketOpen: () => {
            console.log('open')
            ws.subscribe('orderEvents')
            ws.subscribe('executionEvents')
        },
        onWebSocketClose: () => {
            console.log('close')
        },
        onWebSocketError: () => {
            console.log('error')
        },
    })
})()
import { sleep } from "my-utils"
import { getGMOPrivateAPI } from ".."

(async()=>{
    const api = await getGMOPrivateAPI('LOCAL_TEST')
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
    for (const s of ['BUY', 'SELL']) {
        let res = (await api.cancelBulkOrder({
            symbols: ['XRP_JPY'],
            side: s
        }))
        console.log(res)
        while (res && res.data.length > 0) {
            await sleep(500)
            res = (await api.cancelBulkOrder({
                symbols: ['XRP_JPY'],
                side: s
            }))
            console.log(res)
        }
        console.log("end: " + s)
    }
})()
import { gmoPublicStreamClass } from '../lib/public-stream'
import {
    gmoPublicStreamOrderBooksResponse,
    gmoPublicStreamTickerResponse
} from '../lib/responseType'

// 実際のPublic WebSocketに接続して確認する。
describe('gmoPublicStreamClass', () => {
    let stream: gmoPublicStreamClass

    afterEach(() => {
        stream?.close()
    })

    // タイマーを残すとjestのworkerが終了しないため、必ず解除する。
    function withTimeout(
        message: string,
        body: (resolve: () => void, reject: (e: Error) => void) => void
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(message)), 20000)
            const done = () => { clearTimeout(timer); resolve() }
            const fail = (e: Error) => { clearTimeout(timer); reject(e) }
            body(done, fail)
        })
    }

    test('tickerと板情報を受信する', async () => {
        const tickers: gmoPublicStreamTickerResponse[] = []
        const orderbooks: gmoPublicStreamOrderBooksResponse[] = []
        await withTimeout('tickerと板情報を受信できなかった', (done, fail) => {
            stream = new gmoPublicStreamClass({
                reconnect: false,
                ticker: (t) => {
                    tickers.push(t)
                    if (orderbooks.length > 0) { done() }
                },
                orderbooks: (o) => {
                    orderbooks.push(o)
                    if (tickers.length > 0) { done() }
                },
                onWebSocketOpen: () => {
                    stream.subscribe('ticker', 'BTC')
                        .then(() => stream.subscribe('orderbooks', 'BTC'))
                        .catch(fail)
                },
                onWebSocketError: () => fail(new Error('websocket error'))
            })
        })

        expect(tickers[0].channel).toBe('ticker')
        expect(tickers[0].symbol).toBe('BTC')
        expect(parseFloat(tickers[0].last)).toBeGreaterThan(0)
        expect(parseFloat(tickers[0].volume)).toBeGreaterThanOrEqual(0)

        expect(orderbooks[0].channel).toBe('orderbooks')
        expect(orderbooks[0].asks.length).toBeGreaterThan(0)
        expect(parseFloat(orderbooks[0].asks[0].price))
            .toBeGreaterThan(parseFloat(orderbooks[0].bids[0].price))
    })

    test('subscribeは1秒1回の上限を守って送信する', async () => {
        await withTimeout('接続できなかった', (done, fail) => {
            stream = new gmoPublicStreamClass({
                reconnect: false,
                onWebSocketOpen: done,
                onWebSocketError: () => fail(new Error('websocket error'))
            })
        })

        const start = Date.now()
        await stream.subscribe('ticker', 'BTC')
        const first = Date.now() - start
        await stream.subscribe('trades', 'BTC', 'TAKER_ONLY')
        const second = Date.now() - start

        expect(first).toBeLessThan(500)
        expect(second).toBeGreaterThanOrEqual(950)
    })
})

import { gmoFXPublicStreamClass } from '../lib/fx/public-stream'
import { gmoFXPublicStreamTickerResponse } from '../lib/fx/responseType'
import { gmoFXStatus } from '../lib/fx/type'

// 実際のPublic WebSocketに接続して確認する。
// 土日・メンテナンス中でもレートの配信自体は続くため、statusには依存しない。
describe('gmoFXPublicStreamClass', () => {
    let stream: gmoFXPublicStreamClass

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

    test('tickerを受信する', async () => {
        const received: gmoFXPublicStreamTickerResponse[] = []
        await withTimeout('tickerを受信できなかった', (done, fail) => {
            stream = new gmoFXPublicStreamClass({
                reconnect: false,
                ticker: (ticker) => {
                    received.push(ticker)
                    done()
                },
                onWebSocketOpen: () => {
                    stream.subscribe('ticker', 'USD_JPY').catch(fail)
                },
                onWebSocketError: () => fail(new Error('websocket error'))
            })
        })

        const ticker = received[0]
        expect(ticker.symbol).toBe('USD_JPY')
        expect(parseFloat(ticker.bid)).toBeGreaterThan(0)
        expect(parseFloat(ticker.ask)).toBeGreaterThanOrEqual(parseFloat(ticker.bid))
        const statuses: gmoFXStatus[] = ['OPEN', 'CLOSE', 'MAINTENANCE']
        expect(statuses).toContain(ticker.status)
        // FXのtickerはchannelを返さない
        expect((ticker as any).channel).toBeUndefined()
    })

    test('subscribeは1秒1回の上限を守って送信する', async () => {
        await withTimeout('接続できなかった', (done, fail) => {
            stream = new gmoFXPublicStreamClass({
                reconnect: false,
                onWebSocketOpen: done,
                onWebSocketError: () => fail(new Error('websocket error'))
            })
        })

        const start = Date.now()
        await stream.subscribe('ticker', 'USD_JPY')
        const first = Date.now() - start
        await stream.subscribe('ticker', 'EUR_JPY')
        const second = Date.now() - start

        expect(first).toBeLessThan(500)
        expect(second).toBeGreaterThanOrEqual(950)
    })
})

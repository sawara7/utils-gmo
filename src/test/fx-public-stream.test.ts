import { dispatchFXPublicStreamMessage, gmoFXPublicStreamCallbacks } from '../lib/fx/public-stream'
import { gmoFXPublicStreamTickerResponse } from '../lib/fx/responseType'

function makeCallbacks() {
    const received: gmoFXPublicStreamTickerResponse[] = []
    const callbacks: gmoFXPublicStreamCallbacks = { ticker: (t) => received.push(t) }
    return { received, callbacks }
}

// 外国為替FXのtickerはchannelを返さないため、bid/askの有無で判定している
test('channelが無いtickerを受け取れる', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchFXPublicStreamMessage(JSON.stringify({
        symbol: 'USD_JPY',
        ask: '140.534',
        bid: '140.502',
        timestamp: '2018-03-30T12:34:56.789984Z',
        status: 'OPEN'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.length).toBe(1)
    expect(received[0].symbol).toBe('USD_JPY')
    expect((received[0] as any).channel).toBeUndefined()
})

test('bid/askを持たないメッセージは無視する', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchFXPublicStreamMessage(JSON.stringify({ error: 'something' }), callbacks)

    expect(handled).toBe(false)
    expect(received.length).toBe(0)
})

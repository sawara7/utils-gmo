import { dispatchPublicStreamMessage, gmoPublicStreamCallbacks } from '../lib/public-stream'
import {
    gmoPublicStreamOrderBooksResponse,
    gmoPublicStreamTickerResponse,
    gmoPublicStreamTradesResponse
} from '../lib/responseType'

// 受信メッセージの振り分けはネットワーク無しで検証する。
// 入力はドキュメントのResponse exampleをそのまま使う。
function makeCallbacks() {
    const received = {
        ticker: [] as gmoPublicStreamTickerResponse[],
        orderbooks: [] as gmoPublicStreamOrderBooksResponse[],
        trades: [] as gmoPublicStreamTradesResponse[]
    }
    const callbacks: gmoPublicStreamCallbacks = {
        ticker: (t) => received.ticker.push(t),
        orderbooks: (o) => received.orderbooks.push(o),
        trades: (t) => received.trades.push(t)
    }
    return { received, callbacks }
}

test('ticker', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPublicStreamMessage(JSON.stringify({
        channel: 'ticker',
        ask: '750760',
        bid: '750600',
        high: '762302',
        last: '756662',
        low: '704874',
        symbol: 'BTC',
        timestamp: '2018-03-30T12:34:56.789Z',
        volume: '194785.8484'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.ticker.length).toBe(1)
    expect(received.ticker[0].symbol).toBe('BTC')
    expect(received.ticker[0].last).toBe('756662')
    // 定義が漏れていたvolume
    expect(received.ticker[0].volume).toBe('194785.8484')
    expect(received.orderbooks.length).toBe(0)
    expect(received.trades.length).toBe(0)
})

test('orderbooks', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPublicStreamMessage(JSON.stringify({
        channel: 'orderbooks',
        asks: [{ price: '455659', size: '0.1' }],
        bids: [{ price: '455655', size: '0.3' }],
        symbol: 'BTC',
        timestamp: '2018-03-30T12:34:56.789Z'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.orderbooks.length).toBe(1)
    expect(received.orderbooks[0].asks[0].price).toBe('455659')
})

test('trades', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPublicStreamMessage(JSON.stringify({
        channel: 'trades',
        price: '750760',
        side: 'BUY',
        size: '0.1',
        timestamp: '2018-03-30T12:34:56.789Z',
        symbol: 'BTC'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.trades.length).toBe(1)
    expect(received.trades[0].side).toBe('BUY')
})

test('知らないチャンネルは無視する', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPublicStreamMessage(JSON.stringify({ channel: 'unknown' }), callbacks)

    expect(handled).toBe(false)
    expect(received.ticker.length + received.orderbooks.length + received.trades.length).toBe(0)
})

test('コールバック未設定でも落ちない', () => {
    expect(dispatchPublicStreamMessage(JSON.stringify({ channel: 'ticker' }), {})).toBe(true)
})

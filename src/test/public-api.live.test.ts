import { gmoPublicApiClass } from '../lib/public-api'
import { gmoStatus } from '../lib/type'

// 暗号資産のPublic APIは認証不要なので実際のAPIに接続して確認する。
const api = new gmoPublicApiClass({})
const statuses: gmoStatus[] = ['MAINTENANCE', 'PREOPEN', 'OPEN']

test('getStatus', async () => {
    const res = await api.getStatus()
    expect(res.status).toBe(0)
    expect(statuses).toContain(res.data.status)
})

test('getTicker', async () => {
    const res = await api.getTicker({ symbol: 'BTC' })
    expect(res.status).toBe(0)
    expect(res.data.length).toBe(1)

    const ticker = res.data[0]
    expect(ticker.symbol).toBe('BTC')
    expect(parseFloat(ticker.bid)).toBeGreaterThan(0)
    expect(parseFloat(ticker.ask)).toBeGreaterThanOrEqual(parseFloat(ticker.bid))
    // FXと違い last と volume が返る
    expect(parseFloat(ticker.last)).toBeGreaterThan(0)
    expect(parseFloat(ticker.volume)).toBeGreaterThanOrEqual(0)
})

test('getOrderbooks', async () => {
    const res = await api.getOrderbooks({ symbol: 'BTC' })
    expect(res.status).toBe(0)
    expect(res.data.asks.length).toBeGreaterThan(0)
    expect(res.data.bids.length).toBeGreaterThan(0)
    // 売り板の最良値は買い板の最良値より高い
    expect(parseFloat(res.data.asks[0].price)).toBeGreaterThan(parseFloat(res.data.bids[0].price))
})

test('getTrades', async () => {
    const res = await api.getTrades({ symbol: 'BTC', count: 1 })
    expect(res.status).toBe(0)
    expect(res.data.list.length).toBeLessThanOrEqual(1)
    if (res.data.list.length > 0) {
        expect(parseFloat(res.data.list[0].price)).toBeGreaterThan(0)
    }
})

test('getKLines', async () => {
    const date = new Date()
    date.setDate(date.getDate() - 3)
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '')

    const res = await api.getKLines({ symbol: 'BTC', interval: '1hour', date: yyyymmdd })
    expect(res.status).toBe(0)
    expect(res.data.length).toBeGreaterThan(0)

    const kline = res.data[0]
    expect(parseInt(kline.openTime)).toBeGreaterThan(0)
    expect(parseFloat(kline.high)).toBeGreaterThanOrEqual(parseFloat(kline.low))
    // FXと違いvolumeが返る
    expect(parseFloat(kline.volume)).toBeGreaterThanOrEqual(0)
})

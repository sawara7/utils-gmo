import { ApiError } from '../lib/api'
import { gmoFXPublicApiClass } from '../lib/fx/public-api'
import { gmoFXStatus, gmoFXSymbol, gmoFXSymbols } from '../lib/fx/type'

// 外国為替FXのPublic APIは認証不要なので実際のAPIに接続して確認する。
// 土日・メンテナンス中はレートが止まるため、statusに依存しない形で検証する。
const api = new gmoFXPublicApiClass()
const statuses: gmoFXStatus[] = ['OPEN', 'CLOSE', 'MAINTENANCE']

test('getStatus', async () => {
    const res = await api.getStatus()
    expect(res.status).toBe(0)
    expect(statuses).toContain(res.data.status)
})

test('getTicker', async () => {
    const res = await api.getTicker()
    expect(res.status).toBe(0)
    // FXのtickerは銘柄指定ができないため全銘柄が返る
    expect(res.data.length).toBe(gmoFXSymbols.length)

    const usdjpy = res.data.find((t) => t.symbol === 'USD_JPY')
    expect(usdjpy).toBeDefined()
    expect(parseFloat(usdjpy!.bid)).toBeGreaterThan(0)
    expect(parseFloat(usdjpy!.ask)).toBeGreaterThanOrEqual(parseFloat(usdjpy!.bid))
    expect(statuses).toContain(usdjpy!.status)
    // 暗号資産と違いvolumeは返らない
    expect((usdjpy as any).volume).toBeUndefined()
})

test('getTickerBySymbol', async () => {
    const ticker = await api.getTickerBySymbol('USD_JPY')
    expect(ticker.symbol).toBe('USD_JPY')
    expect(parseFloat(ticker.bid)).toBeGreaterThan(0)
})

test('getTickerBySymbol: 存在しない銘柄はApiError', async () => {
    await expect(api.getTickerBySymbol('XXX_YYY' as gmoFXSymbol)).rejects.toBeInstanceOf(ApiError)
})

test('getSymbols: type.tsの銘柄一覧がAPIと一致している', async () => {
    const res = await api.getSymbols()
    expect(res.status).toBe(0)

    const fromApi = res.data.map((s) => s.symbol).sort()
    expect(fromApi).toEqual([...gmoFXSymbols].sort())

    const usdjpy = res.data.find((s) => s.symbol === 'USD_JPY')
    expect(usdjpy).toBeDefined()
    expect(parseFloat(usdjpy!.tickSize)).toBeGreaterThan(0)
    expect(parseFloat(usdjpy!.minOpenOrderSize)).toBeGreaterThan(0)
})

test('getKLines', async () => {
    // 直近の平日（祝日で0件になることもあるため件数は条件にしない）
    const date = new Date()
    date.setDate(date.getDate() - 3)
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() - 1)
    }
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '')

    const res = await api.getKLines({
        symbol: 'USD_JPY',
        priceType: 'BID',
        interval: '1hour',
        date: yyyymmdd
    })
    expect(res.status).toBe(0)
    expect(Array.isArray(res.data)).toBe(true)

    if (res.data.length > 0) {
        const kline = res.data[0]
        expect(parseInt(kline.openTime)).toBeGreaterThan(0)
        expect(parseFloat(kline.high)).toBeGreaterThanOrEqual(parseFloat(kline.low))
        // 暗号資産と違いvolumeは返らない
        expect((kline as any).volume).toBeUndefined()
    }
})

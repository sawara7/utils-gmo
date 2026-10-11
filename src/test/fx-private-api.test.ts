import * as crypto from 'crypto'
import { gmoFXPrivateApiClass } from '../lib/fx/private-api'

// Private APIは実際に叩くと発注してしまうため、送信直前のaxiosオプションを
// optionsCallbackで差し押さえ、パス・メソッド・クエリ・署名だけを検証する。
const API_KEY = 'TEST_API_KEY'
const API_SECRET = 'TEST_API_SECRET'

class InterceptedError extends Error {
    constructor(readonly options: any) {
        super('INTERCEPTED')
    }
}

const api = new gmoFXPrivateApiClass(
    { apiKey: API_KEY, apiSecret: API_SECRET },
    {
        optionsCallback: (options: any) => {
            throw new InterceptedError(options)
        }
    }
)

async function capture(request: () => Promise<unknown>): Promise<any> {
    try {
        await request()
    } catch (e) {
        if (e instanceof InterceptedError) { return e.options }
        throw e
    }
    throw new Error('リクエストが送信されてしまった')
}

// 署名は「タイムスタンプ + メソッド + /v1から始まるパス + リクエストボディ」のHMAC-SHA256
function expectSigned(options: any, method: string, path: string, body: string) {
    expect(options.method).toBe(method)
    expect(options.baseURL).toBe('https://forex-api.coin.z.com/private')
    expect(options.url).toBe(path)
    expect(options.headers['API-KEY']).toBe(API_KEY)

    const timestamp = options.headers['API-TIMESTAMP']
    expect(timestamp).toMatch(/^\d{13}$/)
    const expected = crypto.createHmac('sha256', API_SECRET)
        .update(timestamp + method + path + body)
        .digest('hex')
    expect(options.headers['API-SIGN']).toBe(expected)
}

test('GET: ボディを空文字列として署名する', async () => {
    const options = await capture(() => api.getAssets())
    expectSigned(options, 'GET', '/v1/account/assets', '')
})

test('GET: クエリは署名に含めない', async () => {
    const options = await capture(() => api.getActiveOrders({ symbol: 'USD_JPY', count: 1 }))
    expect(options.params).toEqual({ symbol: 'USD_JPY', count: '1' })
    expectSigned(options, 'GET', '/v1/activeOrders', '')
})

test('GET: 未指定のパラメータはクエリに入れない', async () => {
    const options = await capture(() => api.getOpenPositions({ symbol: 'USD_JPY' }))
    expect(options.params).toEqual({ symbol: 'USD_JPY' })
})

test('GET: 配列パラメータはカンマ区切りにする', async () => {
    const options = await capture(() => api.getOrders({ orderId: [123456789, 223456789] }))
    expect(options.params).toEqual({ orderId: '123456789,223456789' })
})

test('POST: ボディを含めて署名する', async () => {
    const request = {
        symbol: 'USD_JPY' as const,
        side: 'BUY' as const,
        size: '10000',
        executionType: 'LIMIT' as const,
        limitPrice: '140'
    }
    const options = await capture(() => api.postOrder(request))
    expect(options.data).toEqual(request)
    expectSigned(options, 'POST', '/v1/order', JSON.stringify(request))
})

test('POST: 決済注文はsettlePositionをそのまま送る', async () => {
    const request = {
        symbol: 'USD_JPY' as const,
        side: 'SELL' as const,
        executionType: 'MARKET' as const,
        settlePosition: [{ positionId: 1000342, size: '10000' }]
    }
    const options = await capture(() => api.postCloseOrder(request))
    expect(options.data).toEqual(request)
    expectSigned(options, 'POST', '/v1/closeOrder', JSON.stringify(request))
})

test('POST: アクセストークン取得は空ボディ', async () => {
    const options = await capture(() => api.getWebsocketAccessToken())
    expectSigned(options, 'POST', '/v1/ws-auth', '{}')
})

// PUT / DELETE はボディを送るが、公式サンプルどおり署名には含めない
test('PUT: アクセストークン延長はボディを署名に含めない', async () => {
    const options = await capture(() => api.updateWebsocketAccessToken('dummy-token'))
    expect(options.data).toEqual({ token: 'dummy-token' })
    expectSigned(options, 'PUT', '/v1/ws-auth', '')
})

test('DELETE: アクセストークン削除はボディを署名に含めない', async () => {
    const options = await capture(() => api.deleteWebsocketAccessToken('dummy-token'))
    expect(options.data).toEqual({ token: 'dummy-token' })
    expectSigned(options, 'DELETE', '/v1/ws-auth', '')
})

import * as crypto from 'crypto'
import { gmoPrivateApiClass } from '../lib/private-api'

// 暗号資産のPrivate APIも、実際に叩くと発注してしまうため
// 送信直前のaxiosオプションを差し押さえて、パス・メソッド・クエリ・署名だけを検証する。
const API_KEY = 'TEST_API_KEY'
const API_SECRET = 'TEST_API_SECRET'

class InterceptedError extends Error {
    constructor(readonly options: any) {
        super('INTERCEPTED')
    }
}

const api = new gmoPrivateApiClass(
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

function expectSigned(options: any, method: string, path: string, body: string) {
    expect(options.method).toBe(method)
    expect(options.baseURL).toBe('https://api.coin.z.com/private')
    expect(options.url).toBe(path)
    expect(options.headers['API-KEY']).toBe(API_KEY)

    const timestamp = options.headers['API-TIMESTAMP']
    expect(timestamp).toMatch(/^\d{13}$/)
    const expected = crypto.createHmac('sha256', API_SECRET)
        .update(timestamp + method + path + body)
        .digest('hex')
    expect(options.headers['API-SIGN']).toBe(expected)
}

test('GET: 余力情報', async () => {
    const options = await capture(() => api.getMargin())
    expectSigned(options, 'GET', '/v1/account/margin', '')
})

test('GET: 有効注文一覧はクエリを署名に含めない', async () => {
    const options = await capture(() => api.getActiveOrders({ symbol: 'BTC_JPY', count: 1 }))
    expect(options.params).toEqual({ symbol: 'BTC_JPY', count: 1 })
    expectSigned(options, 'GET', '/v1/activeOrders', '')
})

test('GET: 注文情報取得は注文IDをカンマ区切りにする', async () => {
    const options = await capture(() => api.getOrders(['123456789', '223456789']))
    expect(options.params).toEqual({ orderId: '123456789,223456789' })
    expectSigned(options, 'GET', '/v1/orders', '')
})

test('POST: 新規注文はボディを含めて署名する', async () => {
    const request = {
        symbol: 'BTC_JPY',
        side: 'BUY',
        executionType: 'LIMIT',
        size: '0.01',
        price: '10000000'
    }
    const options = await capture(() => api.postOrder(request))
    expect(options.data).toEqual(request)
    expectSigned(options, 'POST', '/v1/order', JSON.stringify(request))
})

test('POST: アクセストークン取得は空ボディ', async () => {
    const options = await capture(() => api.getWebsocketAccessToken())
    expectSigned(options, 'POST', '/v1/ws-auth', '{}')
})

// 公式サンプル（Node.js）もPUT/DELETEはボディを署名に含めていないため、この挙動が正しい
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

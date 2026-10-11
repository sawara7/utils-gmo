import { dispatchPrivateStreamMessage, gmoPrivateStreamCallbacks } from '../lib/private-stream'
import {
    gmoPrivateStreamExecutionResponse,
    gmoPrivateStreamOrderResponse,
    gmoPrivateStreamPositionResponse,
    gmoPrivateStreamPositionSummaryResponse
} from '../lib/responseType'

// 受信メッセージの振り分けはネットワーク無しで検証する。
// 入力はドキュメントのResponse exampleをそのまま使う。
function makeCallbacks() {
    const received = {
        execution: [] as gmoPrivateStreamExecutionResponse[],
        order: [] as gmoPrivateStreamOrderResponse[],
        position: [] as gmoPrivateStreamPositionResponse[],
        summary: [] as gmoPrivateStreamPositionSummaryResponse[]
    }
    const callbacks: gmoPrivateStreamCallbacks = {
        execution: (e) => received.execution.push(e),
        order: (o) => received.order.push(o),
        position: (p) => received.position.push(p),
        summary: (s) => received.summary.push(s)
    }
    return { received, callbacks }
}

test('executionEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPrivateStreamMessage(JSON.stringify({
        channel: 'executionEvents',
        orderId: 123456789,
        clientOrderId: 'abc123',
        executionId: 72123911,
        symbol: 'BTC_JPY',
        settleType: 'OPEN',
        executionType: 'LIMIT',
        side: 'BUY',
        executionPrice: '877404',
        executionSize: '0.5',
        positionId: 123456789,
        orderTimestamp: '2019-03-19T02:15:06.081Z',
        executionTimestamp: '2019-03-19T02:15:06.081Z',
        lossGain: '0',
        fee: '323',
        orderPrice: '877200',
        orderSize: '0.8',
        orderExecutedSize: '0.7',
        timeInForce: 'FAS',
        msgType: 'ER'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.execution.length).toBe(1)
    expect(received.execution[0].executionId).toBe(72123911)
    // 定義が漏れていたclientOrderId
    expect(received.execution[0].clientOrderId).toBe('abc123')
})

test('orderEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPrivateStreamMessage(JSON.stringify({
        channel: 'orderEvents',
        orderId: 123456789,
        clientOrderId: 'abc123',
        symbol: 'BTC_JPY',
        settleType: 'OPEN',
        executionType: 'LIMIT',
        side: 'BUY',
        orderStatus: 'CANCELED',
        cancelType: 'USER',
        orderTimestamp: '2019-03-19T02:15:06.081Z',
        orderPrice: '876045',
        orderSize: '0.8',
        orderExecutedSize: '0',
        losscutPrice: '0',
        timeInForce: 'FAS',
        msgType: 'NOR'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.order.length).toBe(1)
    expect(received.order[0].orderStatus).toBe('CANCELED')
})

test('positionEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPrivateStreamMessage(JSON.stringify({
        channel: 'positionEvents',
        positionId: 1234567,
        symbol: 'BTC_JPY',
        side: 'BUY',
        size: '0.22',
        orderdSize: '0',
        price: '876045',
        lossGain: '14',
        leverage: '4',
        losscutPrice: '766540',
        timestamp: '2019-03-19T02:15:06.094Z',
        msgType: 'OPR'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.position.length).toBe(1)
    expect(received.position[0].positionId).toBe(1234567)
})

// 以前は 'positionSummary' と比較していたため、このチャンネルが届いても
// コールバックが呼ばれなかった（チャンネル名は positionSummaryEvents）
test('positionSummaryEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPrivateStreamMessage(JSON.stringify({
        channel: 'positionSummaryEvents',
        symbol: 'BTC_JPY',
        side: 'BUY',
        averagePositionRate: '1014484',
        positionLossGain: '18',
        sumOrderQuantity: '0.01',
        sumPositionQuantity: '0.03',
        timestamp: '2020-06-24T09:53:19.702Z',
        msgType: 'UPDATE'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.summary.length).toBe(1)
    expect(received.summary[0].sumPositionQuantity).toBe('0.03')
})

test('知らないチャンネルは無視する', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchPrivateStreamMessage(JSON.stringify({ channel: 'positionSummary' }), callbacks)

    expect(handled).toBe(false)
    expect(received.summary.length).toBe(0)
})

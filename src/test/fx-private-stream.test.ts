import { dispatchFXPrivateStreamMessage, gmoFXPrivateStreamCallbacks } from '../lib/fx/private-stream'
import {
    gmoFXPrivateStreamExecutionResponse,
    gmoFXPrivateStreamOrderResponse,
    gmoFXPrivateStreamPositionResponse,
    gmoFXPrivateStreamPositionSummaryResponse
} from '../lib/fx/responseType'

// 入力はドキュメントのResponse exampleをそのまま使う。
function makeCallbacks() {
    const received = {
        execution: [] as gmoFXPrivateStreamExecutionResponse[],
        order: [] as gmoFXPrivateStreamOrderResponse[],
        position: [] as gmoFXPrivateStreamPositionResponse[],
        summary: [] as gmoFXPrivateStreamPositionSummaryResponse[]
    }
    const callbacks: gmoFXPrivateStreamCallbacks = {
        execution: (e) => received.execution.push(e),
        order: (o) => received.order.push(o),
        position: (p) => received.position.push(p),
        summary: (s) => received.summary.push(s)
    }
    return { received, callbacks }
}

test('executionEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchFXPrivateStreamMessage(JSON.stringify({
        channel: 'executionEvents',
        amount: '-30',
        rootOrderId: 123456789,
        orderId: 123456789,
        clientOrderId: 'abc123',
        executionId: 72123911,
        symbol: 'USD_JPY',
        settleType: 'OPEN',
        orderType: 'NORMAL',
        executionType: 'LIMIT',
        side: 'BUY',
        executionPrice: '138.963',
        executionSize: '10000',
        positionId: 123456789,
        lossGain: '0',
        settledSwap: '0',
        fee: '-30',
        orderPrice: '140',
        orderExecutedSize: '10000',
        orderSize: '10000',
        msgType: 'ER',
        orderTimestamp: '2019-03-19T02:15:06.081Z',
        executionTimestamp: '2019-03-19T02:15:06.081Z'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.execution.length).toBe(1)
    expect(received.execution[0].settledSwap).toBe('0')
})

test('orderEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchFXPrivateStreamMessage(JSON.stringify({
        channel: 'orderEvents',
        rootOrderId: 123456789,
        clientOrderId: 'abc123',
        orderId: 123456789,
        symbol: 'USD_JPY',
        settleType: 'OPEN',
        orderType: 'NORMAL',
        executionType: 'LIMIT',
        side: 'BUY',
        orderStatus: 'ORDERED',
        orderTimestamp: '2019-03-19T02:15:06.081Z',
        orderPrice: '135',
        orderSize: '10000',
        expiry: '20190418',
        msgType: 'NOR'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.order[0].orderStatus).toBe('ORDERED')
})

test('positionEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchFXPrivateStreamMessage(JSON.stringify({
        channel: 'positionEvents',
        positionId: 1234567,
        symbol: 'USD_JPY',
        side: 'BUY',
        size: '500',
        orderdSize: '0',
        price: '139.772',
        lossGain: '-553.5',
        timestamp: '2019-03-19T02:15:06.094Z',
        totalSwap: '-34.4',
        msgType: 'UPR'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.position[0].totalSwap).toBe('-34.4')
})

test('positionSummaryEvents', () => {
    const { received, callbacks } = makeCallbacks()
    const handled = dispatchFXPrivateStreamMessage(JSON.stringify({
        channel: 'positionSummaryEvents',
        symbol: 'USD_JPY',
        side: 'BUY',
        averagePositionRate: '138.877',
        positionLossGain: '3644808.1',
        sumOrderedSize: '8000',
        sumPositionSize: '1821000',
        sumTotalSwap: '167407.6',
        timestamp: '2020-06-24T09:53:19.702Z',
        msgType: 'PERIODIC'
    }), callbacks)

    expect(handled).toBe(true)
    expect(received.summary[0].sumPositionSize).toBe('1821000')
})

test('知らないチャンネルは無視する', () => {
    const { received, callbacks } = makeCallbacks()
    expect(dispatchFXPrivateStreamMessage(JSON.stringify({ channel: 'ticker' }), callbacks)).toBe(false)
    expect(received.execution.length).toBe(0)
})

# utils-gmo

[![CI](https://github.com/sawara7/utils-gmo/actions/workflows/ci.yml/badge.svg)](https://github.com/sawara7/utils-gmo/actions/workflows/ci.yml)

GMOコインのAPIクライアント（TypeScript）。暗号資産と外国為替FXの両方に対応。

| | 暗号資産 | 外国為替FX |
| --- | --- | --- |
| REST Public | `gmoPublicApiClass` | `gmoFXPublicApiClass` |
| REST Private | `gmoPrivateApiClass` | `gmoFXPrivateApiClass` |
| WebSocket Public | `gmoPublicStreamClass` | `gmoFXPublicStreamClass` |
| WebSocket Private | `gmoPrivateStreamAPIClass` | `gmoFXPrivateStreamClass` |

- 暗号資産: `https://api.coin.z.com` / `wss://api.coin.z.com`（[ドキュメント](https://api.coin.z.com/docs/)）
- 外国為替FX: `https://forex-api.coin.z.com` / `wss://forex-api.coin.z.com`（[ドキュメント](https://api.coin.z.com/fxdocs/)）

エラー時もHTTPは200で返り `status: 1` と `messages` が入るため、呼び出し側で `status === 0` を確認する。
暗号資産とFXでクラスの形は揃えてあり、どちらも `subscribe` / `unsubscribe` / `close` を持ち、
`subscribe` の1秒1回制限はクラス側で吸収する。

## インストール

```
npm install github:sawara7/utils-gmo#v0.1.0
```

タグを付けずに指定するとmainのHEADを取得するため、botから使う場合はタグで固定する。
インストール時に `prepare` スクリプトで `dist` がビルドされる。

## 暗号資産 WebSocket

```ts
import { gmoPublicStreamClass, gmoPrivateStreamAPIClass } from 'utils-gmo'

// Public: 最新レート・板情報・取引履歴
const publicStream = new gmoPublicStreamClass({
  reconnect: true,
  ticker: (t) => console.log(t.symbol, t.bid, t.ask, t.last, t.volume),
  orderbooks: (o) => console.log(o.asks[0], o.bids[0]),
  trades: (t) => console.log(t.price, t.side, t.size),
  onWebSocketOpen: async () => {
    await publicStream.subscribe('ticker', 'BTC')
    await publicStream.subscribe('orderbooks', 'BTC')
    await publicStream.subscribe('trades', 'BTC', 'TAKER_ONLY') // Takerのみ配信
  }
})

// Private: 約定・注文・建玉・建玉サマリー
const privateStream = new gmoPrivateStreamAPIClass('YOUR_KEY', 'YOUR_SECRET', {
  reconnect: true,
  execution: (e) => console.log(e.executionId, e.executionPrice),
  order: (o) => console.log(o.orderId, o.orderStatus),
  position: (p) => console.log(p.positionId, p.lossGain),
  summary: (s) => console.log(s.symbol, s.side, s.sumPositionQuantity),
  onWebSocketOpen: async () => {
    await privateStream.subscribe('executionEvents')
    await privateStream.subscribe('orderEvents')
    await privateStream.subscribe('positionSummaryEvents', 'PERIODIC') // 5秒ごとに配信
  }
})
```

- `trades` の `TAKER_ONLY` と `positionSummaryEvents` の `PERIODIC` は暗号資産側だけのオプション。
- 銘柄は `gmoSpotPairs`（現物17銘柄）と `gmoLeveragePairs`（レバレッジ12銘柄）、
  その合計が `gmoPairs`。
- Privateはアクセストークン（有効期限60分）を自動で取得し、30分ごとに延長する。
  `close()` でトークンを削除して終了できる。

## 外国為替FX Public API

```ts
import { gmoFXPublicApiClass } from 'utils-gmo'

const api = new gmoFXPublicApiClass()

// サービス全体の稼働状態（OPEN / CLOSE / MAINTENANCE）
const status = await api.getStatus()

// USD/JPYの最新レート
const usdjpy = await api.getTickerBySymbol('USD_JPY')
console.log(usdjpy.bid, usdjpy.ask)

// 全銘柄の最新レート（FXのtickerは銘柄指定ができないため常に全銘柄が返る）
const tickers = await api.getTicker()

// 取引ルール（最小注文数量・価格刻みなど）
const symbols = await api.getSymbols()

// 1時間足（volumeは返らない）
const klines = await api.getKLines({
  symbol: 'USD_JPY',
  priceType: 'BID',
  interval: '1hour',
  date: '20261009'
})
```

土日やメンテナンス中は `status` が `CLOSE` / `MAINTENANCE` になり、tickerのレートは直近値のまま止まる。

## 外国為替FX Private API

認証は暗号資産と同じHMAC-SHA256（`API-KEY` / `API-TIMESTAMP` / `API-SIGN`）。
署名対象は `タイムスタンプ + メソッド + /v1から始まるパス + リクエストボディ`で、クエリ文字列は含めない。

```ts
import { gmoFXPrivateApiClass } from 'utils-gmo'

const api = new gmoFXPrivateApiClass({ apiKey: 'YOUR_KEY', apiSecret: 'YOUR_SECRET' })

// 資産残高（dataは要素1つの配列）
const assets = await api.getAssets()
console.log(assets.data[0].availableAmount)

// 参照系
await api.getActiveOrders({ symbol: 'USD_JPY' })
await api.getOrders({ orderId: [123456789, 223456789] }) // 配列はカンマ区切りに変換される
await api.getExecutions({ orderId: 123456789 })
await api.getLatestExecutions({ symbol: 'USD_JPY' })
await api.getOpenPositions({ symbol: 'USD_JPY' })
await api.getPositionSummary({ symbol: 'USD_JPY' })

// 発注系
await api.postOrder({
  symbol: 'USD_JPY',
  side: 'BUY',
  size: '10000',
  executionType: 'LIMIT',
  limitPrice: '140'
})
await api.postSpeedOrder({ symbol: 'USD_JPY', side: 'BUY', size: '10000' })

// IFD（2次注文の売買区分は1次の反対になる）
await api.postIfdOrder({
  symbol: 'USD_JPY',
  firstSide: 'BUY',
  firstExecutionType: 'LIMIT',
  firstSize: '10000',
  firstPrice: '140',
  secondExecutionType: 'LIMIT',
  secondSize: '10000',
  secondPrice: '145'
})

// IFDOCO
await api.postIfoOrder({
  symbol: 'USD_JPY',
  firstSide: 'BUY',
  firstExecutionType: 'LIMIT',
  firstSize: '10000',
  firstPrice: '140',
  secondSize: '10000',
  secondLimitPrice: '145',
  secondStopPrice: '135'
})

await api.postCloseOrder({
  symbol: 'USD_JPY',
  side: 'SELL',
  executionType: 'MARKET',
  settlePosition: [{ positionId: 1000342, size: '10000' }]
})

// 変更・取消
await api.changeOrder({ orderId: 123456789, price: '139' })
await api.changeOcoOrder({ rootOrderId: 123456789, limitPrice: '141' })
await api.changeIfdOrder({ rootOrderId: 123456789, firstPrice: '136' })
await api.changeIfoOrder({ rootOrderId: 123456789, firstPrice: '136' })
await api.cancelOrders({ rootOrderIds: [123456789] })
await api.cancelBulkOrder({ symbols: ['USD_JPY'], side: 'BUY', settleType: 'OPEN' })
```

APIの呼出上限は同一アカウントでGETが毎秒6回、POSTが毎秒1回。
クラス内で送信間隔を空けているが、デフォルトはGET基準（1/6秒）なので、
発注を連続で投げる場合は `sendingInterval: 1000` を渡して1秒間隔にする。
参照用と発注用でインスタンスを分けるのが確実。

### 署名の注意点

`PUT` と `DELETE`（アクセストークンの延長・削除）は、リクエストボディを送るが**署名には含めない**。
ドキュメントの文章では「ボディを連結する」と書かれているが、
公式サンプルコードは `timestamp + method + path` だけで署名しており、暗号資産側も同じ。
サンプルに合わせてある。`ERR-5010`（署名不正）が出るようになったらここを疑う。

## 外国為替FX WebSocket

`subscribe` / `unsubscribe` は同一IPで毎秒1回が上限。クラス側で送信を直列化して1秒間隔を空けるため、
連続して呼んでも上限に当たらない（`await`すると実際に送られたタイミングで返る）。

```ts
import { gmoFXPublicStreamClass, gmoFXPrivateStreamClass } from 'utils-gmo'

// Public: 最新レート
const publicStream = new gmoFXPublicStreamClass({
  reconnect: true,
  ticker: (t) => console.log(t.symbol, t.bid, t.ask, t.status),
  onWebSocketOpen: async () => {
    await publicStream.subscribe('ticker', 'USD_JPY')
    await publicStream.subscribe('ticker', 'EUR_JPY')
  }
})

// Private: 約定・注文・建玉・建玉サマリー
const privateStream = new gmoFXPrivateStreamClass('YOUR_KEY', 'YOUR_SECRET', {
  reconnect: true,
  execution: (e) => console.log(e.executionId, e.executionPrice),
  order: (o) => console.log(o.orderId, o.orderStatus),
  position: (p) => console.log(p.positionId, p.lossGain),
  summary: (s) => console.log(s.symbol, s.side, s.sumPositionSize),
  onWebSocketOpen: async () => {
    await privateStream.subscribe('executionEvents')
    await privateStream.subscribe('orderEvents')
    await privateStream.subscribe('positionSummaryEvents', 'PERIODIC') // 5秒ごとに配信
  }
})
```

- Public WebSocketのtickerは暗号資産と違い `channel` を返さない（実機で確認済み）。
- Privateはアクセストークン（有効期限60分）を自動で取得し、30分ごとに延長する。
  `close()` でトークンを削除して終了できる。
- Privateのsubscribeには、会員ページのAPIキー設定で各通知のパーミッションが必要。

## テスト

```
npm test           # 全部
npm run test:unit  # ネットワーク不要（CIの必須ゲート）
npm run test:live  # 実際のGMOコインのAPIに接続する
```

- `*.test.ts` — ネットワーク不要。Private APIは発注してしまわないよう、送信直前のリクエストを
  `optionsCallback` で差し押さえ、パス・メソッド・クエリ・署名だけを検証する。
  WebSocketの受信メッセージの振り分けは `dispatch*StreamMessage` として関数に切り出してあり、
  ドキュメントのResponse exampleを入力にして検証する。
- `*.live.test.ts` — 実APIに接続する。`getSymbols` は `type.ts` / `fx/type.ts` の銘柄一覧とAPIの
  一覧が一致しているかを検証するので、GMOコインが銘柄を追加したらここで落ちる。
  CIでは毎朝（07:00 JST）走らせてAPI変更を検知する。

FXのPrivate WebSocketと、Private APIの実接続はAPIキーが必要なためテストしていない。

## 開発

```
npm install        # prepareでビルドも走る
npm run build      # tsc
npm run rebuild    # distを消してからビルド
```

`dist` はリポジトリにコミットする（GitHub経由でインストールする利用側がそのまま読むため）。
CIで `dist` が `src` と一致しているかを検証しているので、`src` を変えたら `npm run build` して一緒にコミットする。
テストは `tsconfig.json` の `exclude` により `dist` には出力されない。

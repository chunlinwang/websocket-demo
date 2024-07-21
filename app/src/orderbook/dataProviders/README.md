# How can I integrate a new provider?

## Add a new websocket provider file
We can add a new websocket class to integrate a new provider.

## Extends the websocket abstract class.

\!/ All providers should be an implementation of OrderBookWebSocketAbstract.

I prepared the common methods in this abstract class.

This is an example:
```typescript
export class BinanceOrderBook extends OrderBookWebSocketAbstract {}
```

## inject the service in the module.
```typescript
providers: [
  OrderBookService,
  BinanceOrderBook,
  HuobiOrderBook,
  KrakenOrderBook,
  {
    provide: 'WEB_SOCKET_PROVIDERS',
    useFactory: (...providers: OrderBookWebSocketAbstract[]) => {
      return providers;
    },
    inject: [
      BinanceOrderBook,
      HuobiOrderBook,
      KrakenOrderBook,
    ],
  },
],
```
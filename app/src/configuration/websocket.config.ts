export interface IWebSocketProviderConfig {
  wsUrl: string;
  reconnectInterval: number;
  subscribeMessageParams?: { [x: string]: unknown };
}

export interface IWebSocketProvidersConfig {
  [name: string]: IWebSocketProviderConfig;
}

export const webSocketProviders: IWebSocketProvidersConfig = {
  binance: {
    wsUrl: process.env.BINANCE_WS_URL,
    reconnectInterval:
      parseInt(process.env.BINANCE_RECONNECT_INTERVAL, 10) || 5000, // default 5s
  },
  houbi: {
    wsUrl: process.env.HUOBI_WS_URL,
    reconnectInterval:
      parseInt(process.env.HUOBI_RECONNECT_INTERVAL, 10) || 5000, // default 5s
    subscribeMessageParams: {
      sub: 'market.btcusdt.depth.step0',
      id: 'id1',
    },
  },
  kraken: {
    wsUrl: process.env.KRAKEN_WS_URL,
    reconnectInterval:
      parseInt(process.env.KRAKEN_RECONNECT_INTERVAL, 10) || 5000, // default 5s
    subscribeMessageParams: {
      channel: 'book',
      depth: 25,
      symbol: ['BTC/USDT'],
    },
  },
};

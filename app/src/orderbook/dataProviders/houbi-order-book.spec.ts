import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';
import { gzip } from 'node-gzip';
import { BinanceOrderBook } from '@orderbook/dataProviders/binance-order-book';
import { OrderBookController } from '@orderbook/orderbook.controller';
import { ConfigService } from '@nestjs/config';
import { OrderBookService } from '@orderbook/orderbook.service';
import { HuobiOrderBook } from '@orderbook/dataProviders/huobi-order-book';
import { KrakenOrderBook } from '@orderbook/dataProviders/kraken-order-book';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';

describe('HuobiOrderBook', () => {
  let gateway: HuobiOrderBook;
  let configService: ConfigService;
  let pinoLogger: PinoLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderBookController],
      providers: [
        {
          provide: 'PinoLogger:BinanceOrderBook',
          useValue: { 'pino-params': { useExisting: true } },
        },
        {
          provide: 'PinoLogger:HuobiOrderBook',
          useValue: { 'pino-params': { useExisting: true }, info: jest.fn() },
        },
        {
          provide: 'PinoLogger:KrakenOrderBook',
          useValue: { 'pino-params': { useExisting: true } },
        },
        ConfigService,
        OrderBookService,
        BinanceOrderBook,
        HuobiOrderBook,
        KrakenOrderBook,
        {
          provide: 'WEB_SOCKET_PROVIDERS',
          useFactory: (...providers: OrderBookWebSocketAbstract[]) => {
            return providers;
          },
          inject: [BinanceOrderBook, HuobiOrderBook, KrakenOrderBook],
        },
      ],
    }).compile();

    gateway = module.get<HuobiOrderBook>(HuobiOrderBook);
    configService = module.get<ConfigService>(ConfigService);
    pinoLogger = module.get<PinoLogger>('PinoLogger:HuobiOrderBook');
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('getName, should be huobi', () => {
    expect(gateway.getName()).toBe('huobi');
  });

  it('Test HuobiOrderBook constracture', () => {
    const configfn = jest.spyOn(configService, 'get').mockReturnValue({
      wsUrl: 'url',
      subscribeMessageParams: {
        sub: 'market.btcusdt.depth.step0',
        id: 'id1',
      },
    });

    new HuobiOrderBook(pinoLogger, configService);

    expect(configfn).toBeCalledTimes(1);
    expect(configfn).toBeCalledWith('webSocketProviders.houbi');
  });

  it('Test HuobiOrderBook upcompress stream', async () => {
    const testStr = 'Hello World';
    const compressed = await gzip(testStr);

    const uncompressData = await gateway.unCompressData(compressed);

    expect(uncompressData.toString()).toBe(testStr);
  });

  it('Test HuobiOrderBook setTopAskAndBis, verify if the mid price is ok.', () => {
    const data = JSON.stringify({
      ch: 'market.btcusdt.depth.step0',
      ts: 1719683146293,
      tick: {
        bids: [
          [61013.41, 1.324378],
          [61012.78, 0.011915],
          [61011.39, 0.012243],
          [61010.9, 0.17],
          [61010.01, 0.109406],
          [61010.0, 0.013398],
          [61008.62, 0.068895],
        ],
        asks: [
          [61013.42, 0.016388],
          [61016.66, 0.013257],
          [61018.08, 0.011884],
          [61019.15, 0.2],
          [61019.16, 0.17],
          [61019.5, 0.014253],
        ],
        version: 171734128829,
        ts: 1719683146204,
      },
    });
    gateway.setTopAskAndBis(data);

    expect(gateway.getMidPrice()).toBe((61013.41 + 61013.42) / 2);
  });

  it('Test HuobiOrderBook, should return null without data', () => {
    expect(gateway.getMidPrice()).toBe(null);
  });
});

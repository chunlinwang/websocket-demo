import { Test, TestingModule } from '@nestjs/testing';
import { OrderBookController } from '@orderbook/orderbook.controller';
import { ConfigService } from '@nestjs/config';
import { OrderBookService } from '@orderbook/orderbook.service';
import { BinanceOrderBook } from '@orderbook/dataProviders/binance-order-book';
import { HuobiOrderBook } from '@orderbook/dataProviders/huobi-order-book';
import { KrakenOrderBook } from '@orderbook/dataProviders/kraken-order-book';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import { PinoLogger } from 'nestjs-pino';

describe('BinanceOrderBook', () => {
  let gateway: BinanceOrderBook;
  let configService: ConfigService;
  let pinoLogger: PinoLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderBookController],
      providers: [
        {
          provide: 'PinoLogger:BinanceOrderBook',
          useValue: {
            'pino-params': { useExisting: true },
            info: jest.fn(),
          },
        },
        {
          provide: 'PinoLogger:HuobiOrderBook',
          useValue: { 'pino-params': { useExisting: true } },
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

    gateway = module.get<BinanceOrderBook>(BinanceOrderBook);
    configService = module.get<ConfigService>(ConfigService);
    pinoLogger = module.get<PinoLogger>('PinoLogger:BinanceOrderBook');
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('getName, should be binance', () => {
    expect(gateway.getName()).toBe('binance');
  });

  it('Test BinanceOrderBook constracture', () => {
    const configfn = jest.spyOn(configService, 'get').mockReturnValue({
      wsUrl: 'url',
    });
    new BinanceOrderBook(pinoLogger, configService);

    expect(configfn).toBeCalledTimes(1);
    expect(configfn).toBeCalledWith('webSocketProviders.binance');
  });

  it('Test BinanceOrderBook setTopAskAndBis, verify if the mid price is ok.', () => {
    const data = JSON.stringify({
      e: 'depthUpdate',
      E: 1719681054633,
      s: 'BTCUSDT',
      U: 48319011886,
      u: 48319011940,
      b: [
        ['60943.13000000', '13.12976000'],
        ['60937.03000000', '0.39246000'],
        ['60933.30000000', '0.00000000'],
        ['60912.52000000', '2.21712000'],
        ['60911.74000000', '3.75151000'],
        ['60862.83000000', '0.00000000'],
      ],
      a: [
        ['60943.14000000', '1.53527000'],
        ['60943.28000000', '0.34851000'],
        ['60945.49000000', '0.00000000'],
        ['60945.56000000', '0.00000000'],
        ['60946.17000000', '0.00000000'],
        ['60946.56000000', '0.10934000'],
      ],
    });
    gateway.setTopAskAndBis(data);

    expect(gateway.getMidPrice()).toBe((60943.13 + 60943.14) / 2);
  });

  it('Test BinanceOrderBook, should return null without data', () => {
    expect(gateway.getMidPrice()).toBe(null);
  });
});

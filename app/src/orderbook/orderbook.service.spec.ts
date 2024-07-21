import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OrderBookController } from '@orderbook/orderbook.controller';
import { OrderBookService } from '@orderbook/orderbook.service';
import { BinanceOrderBook } from '@orderbook/dataProviders/binance-order-book';
import { HuobiOrderBook } from '@orderbook/dataProviders/huobi-order-book';
import { KrakenOrderBook } from '@orderbook/dataProviders/kraken-order-book';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';

describe('OrderBookController', () => {
  let orderBookService: OrderBookService;
  let binanceOrderBook: BinanceOrderBook;
  let huobiOrderBook: HuobiOrderBook;
  let krakenOrderBook: KrakenOrderBook;

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
          inject: [
            BinanceOrderBook,
            HuobiOrderBook,
            KrakenOrderBook,
            // \!/ if we have a new provider, we should add it in this array.
          ],
        },
      ],
    }).compile();

    orderBookService = module.get<OrderBookService>(OrderBookService);
    binanceOrderBook = module.get<BinanceOrderBook>(BinanceOrderBook);
    huobiOrderBook = module.get<HuobiOrderBook>(HuobiOrderBook);
    krakenOrderBook = module.get<KrakenOrderBook>(KrakenOrderBook);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('getMidPrices should return mid prices for all providers', () => {
    const result = {
      binance: 60344.925,
      huobi: 60341.835,
      kraken: 60340.85,
    };

    const binanceOrderBookFn = jest
      .spyOn(binanceOrderBook, 'getMidPrice')
      .mockImplementation(() => 60344.925);

    const krakenOrderBookFn = jest
      .spyOn(krakenOrderBook, 'getMidPrice')
      .mockImplementation(() => 60340.85);

    const huobiOrderBookFn = jest
      .spyOn(huobiOrderBook, 'getMidPrice')
      .mockImplementation(() => 60341.835);

    expect(orderBookService.getMidPrices()).toStrictEqual(result);
    expect(binanceOrderBookFn).toBeCalledTimes(1);
    expect(krakenOrderBookFn).toBeCalledTimes(1);
    expect(huobiOrderBookFn).toBeCalledTimes(1);
  });

  it('One mid price is missing, getMidPrices should return mid prices for all providers', () => {
    const result = {
      binance: null,
      huobi: 60341.835,
      kraken: 60340.85,
    };

    const binanceOrderBookFn = jest
      .spyOn(binanceOrderBook, 'getMidPrice')
      .mockImplementation(() => null);

    const krakenOrderBookFn = jest
      .spyOn(krakenOrderBook, 'getMidPrice')
      .mockImplementation(() => 60340.85);

    const huobiOrderBookFn = jest
      .spyOn(huobiOrderBook, 'getMidPrice')
      .mockImplementation(() => 60341.835);

    expect(orderBookService.getMidPrices()).toStrictEqual(result);
    expect(binanceOrderBookFn).toBeCalledTimes(1);
    expect(krakenOrderBookFn).toBeCalledTimes(1);
    expect(huobiOrderBookFn).toBeCalledTimes(1);
  });

  it('getGlobalPriceIndex should return the average of mid prices for all providers', () => {
    const result = (60344.925 + 60340.85 + 60341.835) / 3;

    const binanceOrderBookFn = jest
      .spyOn(binanceOrderBook, 'getMidPrice')
      .mockImplementation(() => 60344.925);

    const krakenOrderBookFn = jest
      .spyOn(krakenOrderBook, 'getMidPrice')
      .mockImplementation(() => 60340.85);

    const huobiOrderBookFn = jest
      .spyOn(huobiOrderBook, 'getMidPrice')
      .mockImplementation(() => 60341.835);

    expect(orderBookService.getGlobalPriceIndex().toFixed(5)).toBe(
      result.toFixed(5),
    );
    expect(binanceOrderBookFn).toBeCalledTimes(1);
    expect(krakenOrderBookFn).toBeCalledTimes(1);
    expect(huobiOrderBookFn).toBeCalledTimes(1);
  });

  it('One mid price is missing, getGlobalPriceIndex should return the average of mid prices for all providers', () => {
    const result = (50000 + 30000) / 2;

    const binanceOrderBookFn = jest
      .spyOn(binanceOrderBook, 'getMidPrice')
      .mockImplementation(() => 50000);

    const krakenOrderBookFn = jest
      .spyOn(krakenOrderBook, 'getMidPrice')
      .mockImplementation(() => 30000);

    const huobiOrderBookFn = jest
      .spyOn(huobiOrderBook, 'getMidPrice')
      .mockImplementation(() => null);

    expect(orderBookService.getGlobalPriceIndex().toFixed(5)).toBe(
      result.toFixed(5),
    );
    expect(binanceOrderBookFn).toBeCalledTimes(1);
    expect(krakenOrderBookFn).toBeCalledTimes(1);
    expect(huobiOrderBookFn).toBeCalledTimes(1);
  });
});

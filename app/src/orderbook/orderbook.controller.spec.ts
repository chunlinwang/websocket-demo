import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OrderBookController } from '@orderbook/orderbook.controller';
import { OrderBookService } from '@orderbook/orderbook.service';
import { BinanceOrderBook } from '@orderbook/dataProviders/binance-order-book';
import { HuobiOrderBook } from '@orderbook/dataProviders/huobi-order-book';
import { KrakenOrderBook } from '@orderbook/dataProviders/kraken-order-book';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import GlobalPriceIndex from '@orderbook/entities/global-price-index.entity';

describe('OrderBookController', () => {
  let controller: OrderBookController;
  let orderBookService: OrderBookService;

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
          inject: [BinanceOrderBook, HuobiOrderBook, KrakenOrderBook],
        },
      ],
    }).compile();

    controller = module.get<OrderBookController>(OrderBookController);
    orderBookService = module.get<OrderBookService>(OrderBookService);
  });

  it('getMidPrices should return mid prices for all providers', async () => {
    const result = {
      binance: 60344.925,
      huobi: 60341.835,
      kraken: 60340.85,
    };

    const getMidPricesFn = jest
      .spyOn(orderBookService, 'getMidPrices')
      .mockImplementation(() => result);

    expect(await controller.getMidPrices()).toBe(result);
    expect(getMidPricesFn).toBeCalledTimes(1);
  });

  it('getGlobalPriceIndex should return global price index.', async () => {
    const result = {
      globalPriceIndex: 60344.925,
    } as GlobalPriceIndex;

    const getGlobalPriceIndexFn = jest
      .spyOn(orderBookService, 'getGlobalPriceIndex')
      .mockImplementation(() => 60344.925);

    expect(await controller.getGlobalPriceIndex()).toStrictEqual(result);
    expect(getGlobalPriceIndexFn).toBeCalledTimes(1);
  });
});

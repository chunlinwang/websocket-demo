import { Test, TestingModule } from '@nestjs/testing';
import { BinanceOrderBook } from '@orderbook/dataProviders/binance-order-book';
import { OrderBookController } from '@orderbook/orderbook.controller';
import { ConfigService } from '@nestjs/config';
import { OrderBookService } from '@orderbook/orderbook.service';
import { HuobiOrderBook } from '@orderbook/dataProviders/huobi-order-book';
import { KrakenOrderBook } from '@orderbook/dataProviders/kraken-order-book';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import { PinoLogger } from 'nestjs-pino';
import { IWebSocketProviderConfig } from '@configuration/websocket.config';

const snapshopMock = {
  channel: 'book',
  type: 'snapshot',
  data: [
    {
      symbol: 'BTC/USDT',
      bids: [
        {
          price: 61046.3,
          qty: 0.0525992,
        },
        {
          price: 61044.8,
          qty: 0.08379487,
        },
        {
          price: 61044.3,
          qty: 0.05995991,
        },
        {
          price: 61044.1,
          qty: 0.02460974,
        },
        {
          price: 61044,
          qty: 0.00389714,
        },
        {
          price: 61043.7,
          qty: 0.47704368,
        },
        {
          price: 61043,
          qty: 0.00871026,
        },
        {
          price: 61042,
          qty: 0.00029488,
        },
        {
          price: 61041.6,
          qty: 0.11486141,
        },
        {
          price: 61040.4,
          qty: 0.11486372,
        },
        {
          price: 61037.7,
          qty: 0.01966315,
        },
        {
          price: 61037.3,
          qty: 0.11486947,
        },
        {
          price: 61035.7,
          qty: 0.0956,
        },
        {
          price: 61033.9,
          qty: 0.02564805,
        },
        {
          price: 61032.9,
          qty: 0.00983151,
        },
        {
          price: 61031.8,
          qty: 0.04405954,
        },
        {
          price: 61031.5,
          qty: 2.77631343,
        },
        {
          price: 61031.3,
          qty: 0.15,
        },
        {
          price: 61030.2,
          qty: 0.147171,
        },
        {
          price: 61029.2,
          qty: 0.59960538,
        },
        {
          price: 61028.7,
          qty: 0.0956,
        },
        {
          price: 61028.4,
          qty: 0.1148855,
        },
        {
          price: 61022.5,
          qty: 0.0961,
        },
        {
          price: 61021.3,
          qty: 0.1425,
        },
        {
          price: 61020.3,
          qty: 0.04675629,
        },
        {
          price: 61017,
          qty: 0.2037624,
        },
        {
          price: 61016.3,
          qty: 0.0956,
        },
        {
          price: 61015.6,
          qty: 0.393401,
        },
        {
          price: 61010.1,
          qty: 0.0956,
        },
        {
          price: 61009.6,
          qty: 0.19851422,
        },
        {
          price: 61007.8,
          qty: 0.11492959,
        },
        {
          price: 61005.4,
          qty: 0.2459,
        },
        {
          price: 61003.9,
          qty: 0.0956,
        },
        {
          price: 61003.4,
          qty: 0.05157,
        },
        {
          price: 61001.4,
          qty: 0.192,
        },
        {
          price: 61001,
          qty: 0.199125,
        },
        {
          price: 60999.7,
          qty: 0.11494433,
        },
        {
          price: 60995.9,
          qty: 0.11494788,
        },
        {
          price: 60995.2,
          qty: 0.04590525,
        },
        {
          price: 60994.8,
          qty: 0.30385664,
        },
        {
          price: 60993.1,
          qty: 0.0767,
        },
        {
          price: 60989.9,
          qty: 0.09,
        },
        {
          price: 60984.3,
          qty: 0.53484428,
        },
        {
          price: 60984.2,
          qty: 0.08648082,
        },
        {
          price: 60982.4,
          qty: 0.10810102,
        },
        {
          price: 60979.4,
          qty: 0.10810102,
        },
        {
          price: 60974.6,
          qty: 0.5055158,
        },
        {
          price: 60972.3,
          qty: 0.01094099,
        },
        {
          price: 60971.5,
          qty: 0.00041003,
        },
        {
          price: 60970.6,
          qty: 0.00041004,
        },
        {
          price: 60968.1,
          qty: 0.0092,
        },
        {
          price: 60966.9,
          qty: 14.01780548,
        },
        {
          price: 60966.8,
          qty: 1.14949023,
        },
        {
          price: 60966.7,
          qty: 0.7149548,
        },
        {
          price: 60966.2,
          qty: 0.03002337,
        },
        {
          price: 60964.6,
          qty: 0.3071,
        },
        {
          price: 60958,
          qty: 0.0095,
        },
        {
          price: 60955.3,
          qty: 1.22808097,
        },
        {
          price: 60950.8,
          qty: 0.11503534,
        },
        {
          price: 60946.4,
          qty: 0.09,
        },
        {
          price: 60945,
          qty: 0.00855035,
        },
        {
          price: 60941.1,
          qty: 0.757,
        },
        {
          price: 60938.5,
          qty: 0.00119091,
        },
        {
          price: 60934.7,
          qty: 0.51553867,
        },
        {
          price: 60931.9,
          qty: 0.06173922,
        },
        {
          price: 60917.9,
          qty: 0.0001,
        },
        {
          price: 60915,
          qty: 0.00796573,
        },
        {
          price: 60905.4,
          qty: 0.1842,
        },
        {
          price: 60905.2,
          qty: 1.02225,
        },
        {
          price: 60902.8,
          qty: 0.08209,
        },
        {
          price: 60897.9,
          qty: 1.2703734,
        },
        {
          price: 60890.3,
          qty: 0.11514372,
        },
        {
          price: 60872.4,
          qty: 0.08213,
        },
        {
          price: 60866.6,
          qty: 0.00958407,
        },
        {
          price: 60865.4,
          qty: 0.4282,
        },
        {
          price: 60863.9,
          qty: 0.01916995,
        },
        {
          price: 60863.6,
          qty: 0.4184,
        },
        {
          price: 60860.9,
          qty: 2.4759238,
        },
        {
          price: 60853.1,
          qty: 0.18211741,
        },
        {
          price: 60852.1,
          qty: 0.00035496,
        },
        {
          price: 60850.1,
          qty: 0.11521745,
        },
        {
          price: 60849.3,
          qty: 0.00035498,
        },
        {
          price: 60833.6,
          qty: 0.05751307,
        },
        {
          price: 60830.6,
          qty: 0.03075164,
        },
        {
          price: 60830.5,
          qty: 0.07667952,
        },
        {
          price: 60822.5,
          qty: 0.0005,
        },
        {
          price: 60821.9,
          qty: 0.08626446,
        },
        {
          price: 60811.6,
          qty: 0.0958494,
        },
        {
          price: 60808.1,
          qty: 0.0001,
        },
        {
          price: 60785.9,
          qty: 0.83170957,
        },
        {
          price: 60751.5,
          qty: 0.1154145,
        },
        {
          price: 60749.3,
          qty: 0.00167961,
        },
        {
          price: 60744.9,
          qty: 0.1154074,
        },
        {
          price: 60741.6,
          qty: 0.00011524,
        },
        {
          price: 60733.6,
          qty: 0.00131974,
        },
        {
          price: 60727.8,
          qty: 0.5063,
        },
        {
          price: 60720.5,
          qty: 0.75580633,
        },
        {
          price: 60710.5,
          qty: 0.00164716,
        },
        {
          price: 60700.1,
          qty: 0.00308278,
        },
        {
          price: 60698.4,
          qty: 0.0001,
        },
      ],
      asks: [
        {
          price: 61046.4,
          qty: 0.00296731,
        },
        {
          price: 61048.3,
          qty: 0.01721212,
        },
        {
          price: 61049.7,
          qty: 0.01721199,
        },
        {
          price: 61049.9,
          qty: 0.146834,
        },
        {
          price: 61050.5,
          qty: 0.11484481,
        },
        {
          price: 61051,
          qty: 0.01721179,
        },
        {
          price: 61053.2,
          qty: 0.11483979,
        },
        {
          price: 61054.2,
          qty: 0.01721165,
        },
        {
          price: 61054.3,
          qty: 0.0956,
        },
        {
          price: 61055.9,
          qty: 0.03363142,
        },
        {
          price: 61056.7,
          qty: 0.11483315,
        },
        {
          price: 61058.5,
          qty: 0.06568,
        },
        {
          price: 61060.5,
          qty: 0.0956,
        },
        {
          price: 61063,
          qty: 0.05,
        },
        {
          price: 61063.8,
          qty: 1.03409557,
        },
        {
          price: 61063.9,
          qty: 0.10098387,
        },
        {
          price: 61064.7,
          qty: 0.393399,
        },
        {
          price: 61066.2,
          qty: 0.00016375,
        },
        {
          price: 61066.8,
          qty: 5.76250437,
        },
        {
          price: 61066.9,
          qty: 0.11481397,
        },
        {
          price: 61067.3,
          qty: 0.0956,
        },
        {
          price: 61067.8,
          qty: 0.20915073,
        },
        {
          price: 61068.2,
          qty: 0.62355846,
        },
        {
          price: 61068.8,
          qty: 0.06294,
        },
        {
          price: 61069,
          qty: 0.04405954,
        },
        {
          price: 61069.9,
          qty: 0.00871026,
        },
        {
          price: 61070.4,
          qty: 0.03947498,
        },
        {
          price: 61070.8,
          qty: 0.57419276,
        },
        {
          price: 61074.2,
          qty: 0.0956,
        },
        {
          price: 61076,
          qty: 0.98435208,
        },
        {
          price: 61078,
          qty: 0.2461,
        },
        {
          price: 61079.1,
          qty: 0.06274,
        },
        {
          price: 61080.2,
          qty: 0.11478942,
        },
        {
          price: 61080.8,
          qty: 0.0956,
        },
        {
          price: 61082,
          qty: 0.70659762,
        },
        {
          price: 61087,
          qty: 0.0956,
        },
        {
          price: 61088.4,
          qty: 0.31298462,
        },
        {
          price: 61095.6,
          qty: 0.0956,
        },
        {
          price: 61096,
          qty: 0.11476397,
        },
        {
          price: 61098.1,
          qty: 0.04792586,
        },
        {
          price: 61102.6,
          qty: 0.0108,
        },
        {
          price: 61104.7,
          qty: 0.0956,
        },
        {
          price: 61108.3,
          qty: 0.08201,
        },
        {
          price: 61109.9,
          qty: 0.19755,
        },
        {
          price: 61110.9,
          qty: 0.0956,
        },
        {
          price: 61111.7,
          qty: 0.11473439,
        },
        {
          price: 61113.8,
          qty: 0.21000575,
        },
        {
          price: 61113.9,
          qty: 0.231,
        },
        {
          price: 61115.9,
          qty: 0.49853558,
        },
        {
          price: 61116.8,
          qty: 0.0114,
        },
        {
          price: 61120.3,
          qty: 1.34846349,
        },
        {
          price: 61123,
          qty: 0.01126123,
        },
        {
          price: 61123.1,
          qty: 0.0956,
        },
        {
          price: 61132.3,
          qty: 0.29925,
        },
        {
          price: 61132.7,
          qty: 0.0956,
        },
        {
          price: 61132.9,
          qty: 0.08201,
        },
        {
          price: 61133.5,
          qty: 0.10810102,
        },
        {
          price: 61135.2,
          qty: 0.10810102,
        },
        {
          price: 61137,
          qty: 0.08648082,
        },
        {
          price: 61138.2,
          qty: 0.0001,
        },
        {
          price: 61138.6,
          qty: 0.11468402,
        },
        {
          price: 61145.1,
          qty: 0.0956,
        },
        {
          price: 61148.9,
          qty: 0.05887268,
        },
        {
          price: 61163.2,
          qty: 0.0956,
        },
        {
          price: 61163.5,
          qty: 0.92179537,
        },
        {
          price: 61165.7,
          qty: 0.50569478,
        },
        {
          price: 61174.1,
          qty: 0.1909,
        },
        {
          price: 61175.5,
          qty: 0.0956,
        },
        {
          price: 61177.5,
          qty: 0.0005,
        },
        {
          price: 61183.5,
          qty: 0.0015606,
        },
        {
          price: 61183.6,
          qty: 0.00010577,
        },
        {
          price: 61183.7,
          qty: 0.00162543,
        },
        {
          price: 61183.8,
          qty: 0.00067787,
        },
        {
          price: 61187.8,
          qty: 0.0956,
        },
        {
          price: 61189.7,
          qty: 0.638375,
        },
        {
          price: 61193,
          qty: 0.00205641,
        },
        {
          price: 61193.1,
          qty: 0.18,
        },
        {
          price: 61194,
          qty: 0.0956,
        },
        {
          price: 61195.3,
          qty: 0.00134693,
        },
        {
          price: 61200.2,
          qty: 0.0956,
        },
        {
          price: 61203.2,
          qty: 0.00023582,
        },
        {
          price: 61204.3,
          qty: 0.1145548,
        },
        {
          price: 61204.5,
          qty: 0.00080802,
        },
        {
          price: 61204.9,
          qty: 0.00079205,
        },
        {
          price: 61205,
          qty: 0.0012978,
        },
        {
          price: 61206.4,
          qty: 0.0956,
        },
        {
          price: 61207,
          qty: 0.00039899,
        },
        {
          price: 61207.2,
          qty: 0.394,
        },
        {
          price: 61210.4,
          qty: 2.25374738,
        },
        {
          price: 61212.6,
          qty: 0.0956,
        },
        {
          price: 61215.1,
          qty: 0.00014709,
        },
        {
          price: 61217.2,
          qty: 0.00016494,
        },
        {
          price: 61225,
          qty: 0.0956,
        },
        {
          price: 61225.7,
          qty: 0.01130199,
        },
        {
          price: 61225.8,
          qty: 0.01045566,
        },
        {
          price: 61226.4,
          qty: 0.4716,
        },
        {
          price: 61230.1,
          qty: 0.4083,
        },
        {
          price: 61231.2,
          qty: 0.0956,
        },
        {
          price: 61231.9,
          qty: 0.4155,
        },
        {
          price: 61237.4,
          qty: 0.0956,
        },
      ],
      checksum: 1110573308,
    },
  ],
};

const updateDeleteBidMock = {
  channel: 'book',
  type: 'update',
  data: [
    {
      symbol: 'BTC/USDT',
      bids: [
        {
          price: 61046.3,
          qty: 0,
        },
      ],
      asks: [],
      checksum: 3537745049,
      timestamp: '2024-06-29T20:37:44.632717Z',
    },
  ],
};

const updateDeleteAskMock = {
  channel: 'book',
  type: 'update',
  data: [
    {
      symbol: 'BTC/USDT',
      bids: [],
      asks: [
        {
          price: 61046.4,
          qty: 0,
        },
      ],
      checksum: 3537745049,
      timestamp: '2024-06-29T20:37:44.632717Z',
    },
  ],
};

const updateAddNewBidMock = {
  channel: 'book',
  type: 'update',
  data: [
    {
      symbol: 'BTC/USDT',
      bids: [
        {
          price: 61047.3,
          qty: 0.1,
        },
      ],
      asks: [],
      checksum: 3537745049,
      timestamp: '2024-06-29T20:37:44.632717Z',
    },
  ],
};

const updateAddNewAskMock = {
  channel: 'book',
  type: 'update',
  data: [
    {
      symbol: 'BTC/USDT',
      bids: [],
      asks: [
        {
          price: 61040.4,
          qty: 0.1,
        },
      ],
      checksum: 3537745049,
      timestamp: '2024-06-29T20:37:44.632717Z',
    },
  ],
};

const updateNoChangeMock = {
  channel: 'book',
  type: 'update',
  data: [
    {
      symbol: 'BTC/USDT',
      bids: [
        {
          price: 61044.1,
          qty: 0.1,
        },
      ],
      asks: [
        {
          price: 61051,
          qty: 0.01721179,
        },
      ],
      checksum: 3537745049,
      timestamp: '2024-06-29T20:37:44.632717Z',
    },
  ],
};

describe('KrakenOrderBook', () => {
  let gateway: KrakenOrderBook;
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
          useValue: { 'pino-params': { useExisting: true } },
        },
        {
          provide: 'PinoLogger:KrakenOrderBook',
          useValue: { 'pino-params': { useExisting: true }, info: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () =>
              ({
                wsUrl: 'test',
                reconnectInterval: 5000,
                subscribeMessageParams: {
                  channel: 'book',
                  depth: 25,
                  symbol: ['BTC/USDT'],
                },
              }) as IWebSocketProviderConfig,
          },
        },
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

    gateway = module.get<KrakenOrderBook>(KrakenOrderBook);
    configService = module.get<ConfigService>(ConfigService);
    pinoLogger = module.get<PinoLogger>('PinoLogger:KrakenOrderBook');
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('getName, should be kraken', () => {
    expect(gateway.getName()).toBe('kraken');
  });

  it('Test KrakenOrderBook constracture', () => {
    const configfn = jest.spyOn(configService, 'get').mockReturnValue({
      wsUrl: 'url',
      reconnectInterval: 5000,
      subscribeMessageParams: {
        channel: 'book',
        depth: 100,
        symbol: ['BTC/USDT'],
      },
    });
    new KrakenOrderBook(pinoLogger, configService);

    expect(configfn).toBeCalledTimes(1);
    expect(configfn).toBeCalledWith('webSocketProviders.kraken');
  });

  it('Test KrakenOrderBook setTopAskAndBis, verify type snapshot', () => {
    const data = JSON.stringify(snapshopMock);
    gateway.setTopAskAndBis(data);

    expect(gateway.getMidPrice()).toBe((61046.3 + 61046.4) / 2);
  });

  it('Test KrakenOrderBook setTopAskAndBis, verify type update, no change', () => {
    const data = JSON.stringify(snapshopMock);
    gateway.setTopAskAndBis(data);

    const updateNoChangeData = JSON.stringify(updateNoChangeMock);
    gateway.setTopAskAndBis(updateNoChangeData);

    expect(gateway.getMidPrice()).toBe((61046.3 + 61046.4) / 2);
  });

  it('Test KrakenOrderBook setTopAskAndBis, verify type update, remove topBid', () => {
    const snapshotData = JSON.stringify(snapshopMock);
    gateway.setTopAskAndBis(snapshotData);
    const updateDeleteDate = JSON.stringify(updateDeleteBidMock);
    gateway.setTopAskAndBis(updateDeleteDate);

    expect(gateway.getMidPrice()).toBe((61044.8 + 61046.4) / 2);
  });

  it('Test KrakenOrderBook setTopAskAndBis, verify type update, remove topAsk', () => {
    const snapshotData = JSON.stringify(snapshopMock);
    gateway.setTopAskAndBis(snapshotData);
    const updateDeleteAskDate = JSON.stringify(updateDeleteAskMock);
    gateway.setTopAskAndBis(updateDeleteAskDate);

    expect(gateway.getMidPrice()).toBe((61046.3 + 61048.3) / 2);
  });

  it('Test KrakenOrderBook setTopAskAndBis, verify type update, add new topBid', () => {
    const snapshotData = JSON.stringify(snapshopMock);
    gateway.setTopAskAndBis(snapshotData);
    const updateAddBidDate = JSON.stringify(updateAddNewBidMock);
    gateway.setTopAskAndBis(updateAddBidDate);

    expect(gateway.getMidPrice()).toBe((61047.3 + 61046.4) / 2);
  });

  it('Test KrakenOrderBook setTopAskAndBis, verify type update, add new topAsk', () => {
    const snapshotData = JSON.stringify(snapshopMock);
    gateway.setTopAskAndBis(snapshotData);
    const updateAddAskDate = JSON.stringify(updateAddNewAskMock);
    gateway.setTopAskAndBis(updateAddAskDate);

    expect(gateway.getMidPrice()).toBe((61046.3 + 61040.4) / 2);
  });

  it('Test KrakenOrderBook, should return null without data', () => {
    expect(gateway.getMidPrice()).toBe(null);
  });

  it('Test KrakenOrderBook getSnapshotDepth, should return 25', () => {
    expect(gateway.getSnapshotDepth()).toBe(25);
  });
});

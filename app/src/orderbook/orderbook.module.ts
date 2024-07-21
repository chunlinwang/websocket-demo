import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderBookController } from '@orderbook/orderbook.controller';
import { BinanceOrderBook } from '@orderbook/dataProviders/binance-order-book';
import { HuobiOrderBook } from '@orderbook/dataProviders/huobi-order-book';
import { KrakenOrderBook } from '@orderbook/dataProviders/kraken-order-book';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import { OrderBookService } from '@orderbook/orderbook.service';
import { OrderbookGateway } from '@orderbook/websockets/orderbook.gateway';

@Module({
  controllers: [OrderBookController],
  providers: [
    ConfigService,
    OrderBookService,
    OrderbookGateway,
    BinanceOrderBook,
    HuobiOrderBook,
    KrakenOrderBook,
    // \!/ if we have a new provider, we should add it in this array.
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
})
export class OrderBookModule {}

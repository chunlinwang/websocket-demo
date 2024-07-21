import { Inject, Injectable } from '@nestjs/common';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import MidPrices from '@orderbook/entities/mid-prices.entity';

@Injectable()
export class OrderBookService {
  constructor(
    @Inject('WEB_SOCKET_PROVIDERS')
    private readonly providers: OrderBookWebSocketAbstract[],
  ) {}

  getMidPrices(): MidPrices {
    const result = {};

    for (const provider of this.providers) {
      result[provider.getName()] = provider.getMidPrice();
    }

    return result;
  }

  getGlobalPriceIndex(): number {
    let prices = 0;
    let length = 0;
    for (const provider of this.providers) {
      const midPrice = provider.getMidPrice();
      if (midPrice) {
        prices += midPrice;
        length++;
      }
    }

    return prices / length;
  }
}

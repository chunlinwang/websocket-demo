import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderBookService } from '@orderbook/orderbook.service';
import MidPrices from '@orderbook/entities/mid-prices.entity';
import GlobalPriceIndex from '@orderbook/entities/global-price-index.entity';

@Controller({
  path: 'orderbook',
  version: '1',
})
export class OrderBookController {
  constructor(private orderBookService: OrderBookService) {}

  //url: v1/orderbook/global-price-index
  @Get('global-price-index')
  @ApiResponse({
    status: 200,
    description: 'Get global price index, the average of these mid-prices',
    type: GlobalPriceIndex,
  })
  @ApiTags('Orderbook')
  getGlobalPriceIndex(): GlobalPriceIndex {
    return { globalPriceIndex: this.orderBookService.getGlobalPriceIndex() };
  }

  //url: v1/orderbook/mid-prices
  @Get('mid-prices')
  @ApiResponse({
    status: 200,
    description: 'Get Min prices for all providers',
    type: MidPrices,
  })
  @ApiTags('Orderbook')
  getMidPrices(): MidPrices {
    return this.orderBookService.getMidPrices();
  }
}

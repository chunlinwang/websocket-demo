import { ApiProperty } from '@nestjs/swagger';

export default class MidPrices {
  @ApiProperty({
    example: 60344.925,
    description: 'The mid price of the provider binance',
  })
  binance?: number;

  @ApiProperty({
    example: 60341.835,
    description: 'The mid price of the provider huobi',
  })
  huobi?: number;

  @ApiProperty({
    example: 60340.85,
    description: 'The mid price of the provider kraken',
  })
  kraken?: number;
}

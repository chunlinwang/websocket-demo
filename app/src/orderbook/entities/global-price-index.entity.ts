import { ApiProperty } from '@nestjs/swagger';

export default class GlobalPriceIndex {
  @ApiProperty({
    example: 60396.115,
    description: "Get global price index, the average of provider's mid-prices",
  })
  globalPriceIndex: number;
}

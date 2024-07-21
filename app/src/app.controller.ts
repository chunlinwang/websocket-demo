import { Controller, Get, Render } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('websocket')
export class AppController {
  constructor() {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Web Socket',
  })
  @ApiTags('Orderbook')
  @Render('index.hbs')
  websocket() {
    return { title: 'websocket' };
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from '@health/health.module';
import configuration from '@configuration/index';
import { OrderBookModule } from '@orderbook/orderbook.module';
import { AppController } from '@src/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot(),
    OrderBookModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { IWebSocketProviderConfig } from '@configuration/websocket.config';
import { OnModuleDestroy } from '@nestjs/common/interfaces/hooks/on-destroy.interface';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export abstract class OrderBookWebSocketAbstract
  implements OnModuleDestroy, OnModuleInit
{
  @WebSocketServer()
  protected socket: WebSocket;
  protected topAsk: number;
  protected topBid: number;
  protected configs: IWebSocketProviderConfig;
  protected isConnected: boolean = false;

  protected constructor(
    protected readonly logger: PinoLogger,
    protected readonly configService: ConfigService,
  ) {}

  abstract getName(): string;

  abstract setTopAskAndBis(data: string): void;

  protected abstract connect(): void;

  getMidPrice(): number {
    if (!(this.topBid && this.topAsk)) {
      return null;
    }

    return (this.topBid + this.topAsk) / 2;
  }

  protected reconnect() {
    if (!this.isConnected) {
      this.logger.info(`Reconnecting to ${this.getName()} WebSocket`);
      this.connect();
    }
  }

  protected close() {
    if (this.isConnected) {
      this.socket.close();
    }
  }

  onModuleDestroy(): any {
    this.close();
  }

  onModuleInit(): any {
    this.connect();
  }
}

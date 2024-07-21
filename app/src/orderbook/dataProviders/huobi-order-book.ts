import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { ungzip } from 'node-gzip';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { IWebSocketProviderConfig } from '@configuration/websocket.config';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import { IHuobiOrderBookUpdate } from '@orderbook/dataProviders/data-provider.interface';

@WebSocketGateway()
export class HuobiOrderBook extends OrderBookWebSocketAbstract {
  constructor(
    @InjectPinoLogger(HuobiOrderBook.name)
    protected readonly logger: PinoLogger,
    protected readonly configService: ConfigService,
  ) {
    super(logger, configService);

    this.configs = this.configService.get<IWebSocketProviderConfig>(
      'webSocketProviders.houbi',
    );
  }

  async unCompressData(data: string | Buffer) {
    return ungzip(data);
  }

  setTopAskAndBis(data: string): void {
    //@link doc:https://huobiapi.github.io/docs/spot/v1/en/#market-depth
    const message = JSON.parse(data.toString());

    if (message.ping) {
      // Respond to ping with pong to keep the connection alive
      this.socket.send(JSON.stringify({ pong: message.ping }));
    }

    if (message.ch && message.tick) {
      const orderBookUpdate: IHuobiOrderBookUpdate = message;

      this.topBid = orderBookUpdate.tick.bids[0][0];
      this.topAsk = orderBookUpdate.tick.asks[0][0];

      this.logger.info({
        msg: 'Receive Huobi midPrice info',
        midPrice: this.getMidPrice(),
        provider: this.getName(),
      });
    }
  }

  protected connect() {
    this.socket = new WebSocket(this.configs.wsUrl);

    this.socket.on('open', () => {
      this.isConnected = true;
      this.logger.info('Connected to Huobi WebSocket');
      // Subscribe to the BTC/USDT order book
      const subscribeMessage = JSON.stringify(
        this.configs.subscribeMessageParams,
      );
      this.socket.send(subscribeMessage);
    });

    this.socket.on('message', async (data: string) => {
      const unCompressedData = await this.unCompressData(data);

      this.setTopAskAndBis(unCompressedData.toString());
    });

    this.socket.on('error', (error) => {
      this.isConnected = false;
      this.logger.error(`Huobi WebSocket error: ${error.message}`);
      this.socket.close();
    });

    this.socket.on('close', () => {
      this.isConnected = false;
      this.logger.info('Disconnected from Huobi WebSocket');
      setTimeout(() => this.reconnect(), this.configs.reconnectInterval); // Reconnect
    });
  }

  getName(): string {
    return 'huobi';
  }
}

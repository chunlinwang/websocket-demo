import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { ConfigService } from '@nestjs/config';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import { IBinanceOrderBookUpdate } from '@orderbook/dataProviders/data-provider.interface';
import { IWebSocketProviderConfig } from '@configuration/websocket.config';

@WebSocketGateway()
export class BinanceOrderBook extends OrderBookWebSocketAbstract {
  constructor(
    @InjectPinoLogger(BinanceOrderBook.name)
    protected readonly logger: PinoLogger,
    protected readonly configService: ConfigService,
  ) {
    super(logger, configService);

    this.configs = this.configService.get<IWebSocketProviderConfig>(
      'webSocketProviders.binance',
    );
  }

  setTopAskAndBis(data: string): void {
    // @link doc: https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams
    const orderBookUpdate: IBinanceOrderBookUpdate = JSON.parse(data);

    if (orderBookUpdate.b.length > 0 && orderBookUpdate.a.length > 0) {
      this.topBid = parseFloat(orderBookUpdate.b[0][0]);
      this.topAsk = parseFloat(orderBookUpdate.a[0][0]);

      this.logger.info({
        msg: 'Receive Binance midPrice info',
        midPrice: this.getMidPrice(),
        provider: this.getName(),
      });
    }
  }

  protected connect() {
    this.socket = new WebSocket(this.configs.wsUrl);

    this.socket.on('open', () => {
      this.isConnected = true;
      this.logger.info('Connected to Binance WebSocket');
    });

    this.socket.on('message', (data: string) => {
      this.setTopAskAndBis(data);
    });

    this.socket.on('error', (error) => {
      this.isConnected = false;
      this.logger.error(`Binance WebSocket error: ${error.message}`);
      this.socket.close();
    });

    this.socket.on('close', () => {
      this.isConnected = false;
      this.logger.info('Disconnected from Binance WebSocket');
      setTimeout(() => this.reconnect(), this.configs.reconnectInterval); // Reconnect
    });
  }

  getName(): string {
    return 'binance';
  }
}

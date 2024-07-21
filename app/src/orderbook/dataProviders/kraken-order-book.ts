import { WebSocketGateway } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { IWebSocketProviderConfig } from '@configuration/websocket.config';
import { OrderBookWebSocketAbstract } from '@orderbook/dataProviders/order-book-web-socket.abstract';
import {
  IKrakenOrder,
  IKrakenOrderBookPayload,
  IKrakenOrderBookSnapshot,
  IKrakenOrderBookUpdate,
} from '@orderbook/dataProviders/data-provider.interface';

@WebSocketGateway()
export class KrakenOrderBook extends OrderBookWebSocketAbstract {
  constructor(
    @InjectPinoLogger(KrakenOrderBook.name)
    protected readonly logger: PinoLogger,
    protected readonly configService: ConfigService,
  ) {
    super(logger, configService);
    this.configs = this.configService.get<IWebSocketProviderConfig>(
      'webSocketProviders.kraken',
    );
  }

  private orderBookSnapshot: IKrakenOrderBookSnapshot;

  setOrderBookSnapshot(data: Pick<IKrakenOrderBookPayload, 'asks' | 'bids'>) {
    this.orderBookSnapshot = {
      asks: data.asks,
      bids: data.bids,
    };

    if (this.orderBookSnapshot.asks && this.orderBookSnapshot.asks.length > 0) {
      this.topAsk = this.orderBookSnapshot.asks[0].price;
    }
    if (this.orderBookSnapshot.bids && this.orderBookSnapshot.bids.length > 0) {
      this.topBid = this.orderBookSnapshot.bids[0].price;
    }
  }

  updateAsk(orderBookUpdate: Pick<IKrakenOrderBookUpdate, 'asks'>) {
    if (orderBookUpdate.asks) {
      for (const ask of orderBookUpdate.asks) {
        const index = this.orderBookSnapshot.asks.findIndex(
          (o: IKrakenOrder) => o.price === ask.price,
        );

        if (ask.qty === 0) {
          // order is deleted
          this.orderBookSnapshot.asks.splice(index, 1);
        } else {
          if (index !== -1) {
            this.orderBookSnapshot.asks[index].qty = ask.qty;
          } else {
            // update snapshot
            this.orderBookSnapshot.asks.push(ask);
            this.orderBookSnapshot.asks.sort((a, b) => a.price - b.price);
          }
        }

        this.orderBookSnapshot.asks.splice(this.getSnapshotDepth());

        this.topAsk = this.orderBookSnapshot.asks[0].price;
      }
    }
  }

  updateBis(orderBookUpdate: Pick<IKrakenOrderBookUpdate, 'bids'>) {
    if (orderBookUpdate.bids) {
      for (const bid of orderBookUpdate.bids) {
        const index = this.orderBookSnapshot.bids.findIndex(
          (o: IKrakenOrder) => o.price === bid.price,
        );

        if (bid.qty === 0) {
          // order is deleted
          this.orderBookSnapshot.bids.splice(index, 1);
        } else {
          if (index !== -1) {
            this.orderBookSnapshot.bids[index].qty = bid.qty;
          } else {
            this.orderBookSnapshot.bids.push(bid);
            this.orderBookSnapshot.bids.sort((a, b) => b.price - a.price);
          }
        }
      }

      this.orderBookSnapshot.bids.splice(this.getSnapshotDepth());

      this.topBid = this.orderBookSnapshot.bids[0].price;
    }
  }

  setTopAskAndBis(data: string): void {
    // @link doc: https://docs.kraken.com/websockets-v2/#book
    const messages = JSON.parse(data);

    if (messages.data && messages.data[0].symbol) {
      if (messages.type === 'snapshot') {
        this.setOrderBookSnapshot(messages.data[0]);
      }

      if (messages.type === 'update') {
        const orderBookUpdate: IKrakenOrderBookUpdate = {
          asks: messages.data[0].asks,
          bids: messages.data[0].bids,
        };

        this.updateAsk(orderBookUpdate);
        this.updateBis(orderBookUpdate);
      }

      this.logger.info({
        msg: 'Receive Kraken midPrice info',
        midPrice: this.getMidPrice(),
        provider: this.getName(),
      });
    }
  }

  protected connect() {
    this.socket = new WebSocket(this.configs.wsUrl);

    this.socket.on('open', () => {
      this.isConnected = true;
      const subscribeMessage = {
        method: 'subscribe',
        params: this.configs.subscribeMessageParams,
      };

      this.socket.send(JSON.stringify(subscribeMessage));

      this.logger.info('Connected to Kraken WebSocket');
    });

    this.socket.on('message', (data: string) => {
      this.setTopAskAndBis(data);
    });

    this.socket.on('error', (error) => {
      this.isConnected = false;
      this.logger.error(`Kraken WebSocket error: ${error.message}`);
      this.socket.close();
    });

    this.socket.on('close', () => {
      this.isConnected = false;
      this.logger.info('Disconnected from Kraken WebSocket');
      setTimeout(() => this.reconnect(), this.configs.reconnectInterval); // Reconnect
    });
  }

  getName(): string {
    return 'kraken';
  }

  getSnapshotDepth(): number {
    return this.configs.subscribeMessageParams.depth as unknown as number;
  }
}

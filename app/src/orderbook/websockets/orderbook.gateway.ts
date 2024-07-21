import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PinoLogger } from 'nestjs-pino';
import { from, map, Observable } from 'rxjs';
import { OrderBookService } from '@orderbook/orderbook.service';

@WebSocketGateway(3001, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
})
export class OrderbookGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  public constructor(
    private readonly logger: PinoLogger,
    private readonly orderBookService: OrderBookService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.info(`Client connected: ${client.id}`, {
      clientId: client.id,
      args,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client disconnected: ${client.id}`, {
      clientId: client.id,
    });
    this.server.close();
  }

  emitMessageToClient(ev: string, data: unknown) {
    this.server.emit(ev, data);
  }

  afterInit() {
    this.server.emit('event1', {
      name: 'WebSocket event1',
      time: new Date(),
    });

    this.server.emit('event2', {
      name: 'WebSocket event2',
      time: new Date(),
    });

    this.server.emit('orderbook', {
      name: 'WebSocket orderbook',
      time: new Date(),
    });

    setInterval(() => {
      this.server.emit('orderbook', this.orderBookService.getMidPrices());
    }, 2000);
  }

  @SubscribeMessage('event1')
  onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'event1';
    const response = [1, 2, 3];

    this.logger.info({ data, event });

    return from(response).pipe(map((data) => ({ event, data })));
  }

  @SubscribeMessage('event2')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'event2';
    this.logger.info({ data, event });

    return { event, data };
  }
}

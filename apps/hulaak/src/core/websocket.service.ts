import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
}) // This will use the same port as the HTTP server
export class WebsocketService {
  @WebSocketServer()
  server: Server;

  broadcast(ev: string, payload: any): void {
    this.server.emit(ev, payload); // Emit to all connected clients
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log('Message received:', payload);
    return 'Message received: ' + payload;
  }

  @SubscribeMessage('broadcast')
  handleBroadcastMessage(client: Socket, payload: any): void {
    console.log('Broadcasting message:', payload);
    this.server.emit('broadcast', payload); // Emit to all connected clients
  }
}

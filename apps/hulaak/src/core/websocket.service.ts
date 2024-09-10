import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { on } from 'events';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  onConnection: (socket) => {
    console.log('Client connected:', socket.id);
  },
}) // This will use the same port as the HTTP server
export class WebsocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketService.name);
  @WebSocketServer()
  server: Server;
  private clients: Set<Socket> = new Set();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  broadcast(ev: string, payload: any): void {
    this.server.emit(ev, payload); // Emit to all connected clients
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Message received: ' + payload;
  }

  @SubscribeMessage('broadcast')
  handleBroadcastMessage(client: Socket, payload: any): void {
    this.server.emit('broadcast', payload); // Emit to all connected clients
    console.log(client.id);
  }
}

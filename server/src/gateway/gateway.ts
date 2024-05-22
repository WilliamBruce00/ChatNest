import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private onlineUsers = {};
  private room = {};

  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.on('online', (id: string) => {
        this.onlineUsers[socket.id] = id;
        this.server.emit('online', this.onlineUsers);
      });

      socket.on('message', () => {
        this.server.emit('message');
      });

      socket.on('contact', () => {
        this.server.emit('contact');
      });

      socket.on('add friend', () => {
        this.server.emit('add friend');
      });

      socket.on('disconnect', () => {
        delete this.onlineUsers[socket.id];
        this.server.emit('online', this.onlineUsers);
      });
    });
  }
}

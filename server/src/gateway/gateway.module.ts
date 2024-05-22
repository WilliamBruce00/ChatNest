import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [UserModule, ChatModule],
  providers: [MyGateway],
})
export class GatewayModule {}

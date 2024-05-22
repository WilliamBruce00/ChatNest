import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GatewayModule } from './gateway/gateway.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';
import * as express from 'express';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';
import { AddfriendModule } from './addfriend/addfriend.module';
import { FriendModule } from './friend/friend.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { GroupModule } from './group/group.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    UserModule,
    GatewayModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/chatnest'),
    AuthModule,
    OtpModule,
    EmailModule,
    UploadModule,
    ChatModule,
    AddfriendModule,
    FriendModule,
    GroupModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'images')))
      .forRoutes('images');
    consumer
      .apply(AuthMiddleware)
      .exclude('/auth/login', '/auth/status')
      .forRoutes('*');
  }
}

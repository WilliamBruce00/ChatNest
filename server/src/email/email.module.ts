import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'nguyenvantien.coder@gmail.com',
          pass: 'agktjblvfbbxqmyo',
        },
      },
    }),
  ],
  controllers: [EmailController],
  providers: [],
})
export class EmailModule {}

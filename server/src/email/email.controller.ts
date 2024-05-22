import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { EmailDto } from './email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendMail(@Body() emailDto: EmailDto): Promise<any> {
    const mailerOptions = {
      to: emailDto.to,
      subject: emailDto.subject,
      html: emailDto.body,
      from: 'nguyenvantien.coder@gmai.com',
    };
    return await this.mailerService.sendMail(mailerOptions);
  }
}

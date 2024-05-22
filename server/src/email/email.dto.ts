import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;
}

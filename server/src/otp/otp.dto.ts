import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(4)
  code: string;

  @IsNotEmpty()
  data: string;
}

export class UpdateOtpDto {
  @IsOptional()
  @Length(4)
  code: string;

  @IsOptional()
  data: string;
}

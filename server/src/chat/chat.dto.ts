import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from './chat.schema';

export class CreateChatDto {
  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  recipient: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;
}

export class UpdateChatDto {
  @IsOptional()
  message: string;

  @IsOptional()
  status: boolean;
}

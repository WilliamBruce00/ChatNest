import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddFriendDto {
  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  recipient: string;
}

export class UpdateAddFriendDto {
  @IsOptional()
  @IsBoolean()
  seen: boolean;

  @IsOptional()
  status: string;
}

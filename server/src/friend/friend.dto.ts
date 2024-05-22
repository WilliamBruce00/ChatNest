import { IsNotEmpty } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  friendID: string;
}

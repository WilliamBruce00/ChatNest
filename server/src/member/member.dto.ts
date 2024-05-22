import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from './member.schema';

export class CreateMemberDto {
  @IsNotEmpty()
  userID: string;

  @IsNotEmpty()
  groupID: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

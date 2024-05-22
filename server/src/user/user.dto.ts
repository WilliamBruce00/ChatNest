import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

enum Gender {
  NAM = 0,
  NỮ = 1,
}

export class CreateUserDto {
  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsNotEmpty()
  birthday: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: number;

  @IsNotEmpty()
  avatar: string;
}

export class UpdateUserDto {
  @IsOptional()
  fullname: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @Length(6)
  password: string;

  @IsOptional()
  birthday: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  avatar: string;
}

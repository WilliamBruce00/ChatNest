import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum Gender {
  NAM = 0,
  NỮ = 1,
}

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthday: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

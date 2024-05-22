import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  LEADER = 'leader',
  DEPUTY = 'deputy',
  MEMBER = 'member',
}

@Schema()
export class Member {
  @Prop({ required: true })
  userID: string;

  @Prop({ required: true })
  groupID: string;

  @Prop({ required: true, enum: Role })
  role: Role;
}
export const MemberSchema = SchemaFactory.createForClass(Member);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Friend {
  @Prop({ required: true })
  userID: string;

  @Prop({ required: true })
  friendID: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

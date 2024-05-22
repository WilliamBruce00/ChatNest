import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Type {
  MESSAGE = 'message',
  FRIEND = 'friend',
  IMAGE = 'image',
  CREATE_GROUP = 'create group',
  ACCEPTED_ADD_FRIEND = 'accepted add friend',
  FILE = 'file',
}

@Schema()
export class Chat {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, default: Date.now })
  createAt: Date;

  @Prop({ required: true, default: [] })
  seen: string[];

  @Prop({ required: true })
  type: Type;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

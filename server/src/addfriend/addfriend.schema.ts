import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Status {
  PENDING = 'pending',
  REQUEST = 'request',
  REJECTED = 'rejected',
}

@Schema()
export class AddFriend {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true, default: Date.now })
  createAt: Date;

  @Prop({ required: true, enum: Status, default: Status.PENDING })
  status: Status;

  @Prop({ required: true, default: false })
  seen: boolean;
}

export const AddFriendSchema = SchemaFactory.createForClass(AddFriend);

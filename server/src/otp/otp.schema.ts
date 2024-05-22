import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true, default: () => Date.now() + 120000 })
  exp: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

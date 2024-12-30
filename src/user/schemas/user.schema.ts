import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: false, select: false })
  password: string;

  @Prop({ required: false })
  resetPasswordToken: string;

  @Prop({ required: false })
  resetPasswordExpires: Date;

  @Prop({ required: false, default: false })
  isVerified: boolean;

  @Prop({ required: false })
  emailVerificationToken: string;

  @Prop({ required: false })
  emailVerificationExpires: Date;

  @Prop()
  googleId: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Comment {
  @Prop({ required: true })
  movieId: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
  @Prop({ required: true})
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
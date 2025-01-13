import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Vote {
  @Prop({ required: true })
  movieId: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
  @Prop({ 
    required: true, 
    type: Number, 
    min: 1, 
    max: 10,
  })
  vote: number;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
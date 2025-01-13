import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Favorite {
  @Prop({ required: true })
  movieId: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
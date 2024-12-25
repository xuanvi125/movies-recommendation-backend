import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Movie } from 'src/movie/schemas/movie.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class LikedMovie {
  @Prop({ type: SchemaTypes.ObjectId, ref: Movie.name, required: true })
  movieId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const LikedMovieSchema = SchemaFactory.createForClass(LikedMovie);

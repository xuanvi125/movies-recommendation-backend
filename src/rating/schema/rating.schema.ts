import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Max, Min } from 'class-validator';
import { SchemaTypes, Types } from 'mongoose';
import { Movie } from 'src/movie/schemas/movie.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class Rating {
  @Prop({ type: SchemaTypes.ObjectId, ref: Movie.name, required: true })
  movieId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  @Min(1)
  @Max(5)
  rating: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const RatingSchema = SchemaFactory.createForClass(Rating);

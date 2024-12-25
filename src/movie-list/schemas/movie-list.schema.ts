import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Movie } from 'src/movie/schemas/movie.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class MovieList {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Movie.name }] })
  movies: Types.ObjectId[];

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ unique: true })
  sharedUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MovieListSchema = SchemaFactory.createForClass(MovieList);

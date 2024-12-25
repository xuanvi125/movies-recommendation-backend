import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  description: string;

  releaseDate: Date;

  genre: string;

  duration: number;
  rating: number;
}
export const MovieSchema = SchemaFactory.createForClass(Movie);

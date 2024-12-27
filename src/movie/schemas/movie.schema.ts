import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  description: string;

  release_date: string;

  genres: string[];

  rating: number;
}
export const MovieSchema = SchemaFactory.createForClass(Movie);

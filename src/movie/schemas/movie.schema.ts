import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  description: string;

  release_date: string;

  genres: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  ratingQuantity: number;

  @Prop({
    type: {
      cast: { type: [Object], default: [] },
      crew: { type: [Object], default: [] },
    },
    default: { cast: [], crew: [] },
  })
  credits: {
    cast: [];
    crew: [];
  };
}
export const MovieSchema = SchemaFactory.createForClass(Movie);

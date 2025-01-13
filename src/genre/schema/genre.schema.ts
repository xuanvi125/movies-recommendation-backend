import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Genre {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name:string

}
export const GenreSchema = SchemaFactory.createForClass(Genre);

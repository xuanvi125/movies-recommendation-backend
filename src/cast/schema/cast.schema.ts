import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cast {
  @Prop({ required: true })
  name: string;
  age: number;
}

export const CastSchema = SchemaFactory.createForClass(Cast);

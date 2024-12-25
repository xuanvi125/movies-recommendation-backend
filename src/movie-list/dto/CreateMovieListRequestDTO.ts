import { Prop } from '@nestjs/mongoose';

export class CreateMovieListRequestDTO {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

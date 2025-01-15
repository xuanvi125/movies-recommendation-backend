import { Module } from '@nestjs/common';
import { CastService } from './cast.service';
import { CastController } from './cast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CastSchema } from './schema/cast.schema';
import { MovieSchema } from 'src/movie/schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cast', schema: CastSchema }]),
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
  ],
  providers: [CastService],
  controllers: [CastController],
})
export class CastModule {}

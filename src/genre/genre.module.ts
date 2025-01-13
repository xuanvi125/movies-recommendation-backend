import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreSchema } from './schema/genre.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Genre', schema: GenreSchema }])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],

})
export class GenreModule {}

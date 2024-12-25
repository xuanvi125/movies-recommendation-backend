import { Module } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { MovieListController } from './movie-list.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieListSchema } from './schemas/movie-list.schema';
import { UserModule } from 'src/user/user.module';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MovieList', schema: MovieListSchema }]),
    UserModule,
    MovieModule,
  ],
  providers: [MovieListService],
  controllers: [MovieListController],
})
export class MovieListModule {}

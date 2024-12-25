import { Module } from '@nestjs/common';
import { LikedMovieController } from './liked-movie.controller';
import { LikedMovieService } from './liked-movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LikedMovieSchema } from './schemas/liked-movie.schema';
import { UserModule } from 'src/user/user.module';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LikedMovie', schema: LikedMovieSchema },
    ]),
    UserModule,
    MovieModule,
  ],
  controllers: [LikedMovieController],
  providers: [LikedMovieService],
})
export class LikedMovieModule {}

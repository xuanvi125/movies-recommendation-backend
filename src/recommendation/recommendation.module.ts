import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [MovieModule],
  controllers: [RecommendationController],
  providers: [RecommendationService]
})
export class RecommendationModule {}

import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { MovieService } from 'src/movie/movie.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get("/retriever")
  @HttpCode(HttpStatus.OK)
  async getRetriver(@Query('query') query: string) {
    return await this.recommendationService.getRetriver(query);
  }

  @Get("/navigation")
  @HttpCode(HttpStatus.OK)
  async getNavigation(@Query('query') query: string) {
    return await this.recommendationService.getNavigation(query);
  }

}

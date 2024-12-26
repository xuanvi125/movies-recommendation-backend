import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Type,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/trending/:day')
  getTrendingMovies(@Param('day') day: string) {
    return this.movieService.getTrendingMovies(day);
  }

  @Get('/search')
  searchMovies(@Query() q: any) {
    const query = new URLSearchParams(q);
    return this.movieService.searchMovies(query.toString());
  }

  @Get('/:id')
  async getMovieById(@Param('id') id: string) {
    const movie = await this.movieService.getMovieById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    return {
      statusCode: 200,
      message: 'Movie fetched successfully',
      data: movie,
    };
  }

  @Get('/:id/credits')
  getMovieCredits(@Param('id') id: string) {
    return this.movieService.getMovieCredits(id);
  }
}

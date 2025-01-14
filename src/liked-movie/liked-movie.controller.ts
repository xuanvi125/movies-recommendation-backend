import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikedMovieService } from './liked-movie.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import { LikedVideoException } from 'src/exceptions/LikedVideoException';
import mongoose, { Types } from 'mongoose';

@Controller('liked-movies')
export class LikedMovieController {
  constructor(private readonly likedMovieService: LikedMovieService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getLikedMovies(@Req() request: Request, @Query('page') page: number) {
    const user = request['user'];
    const response = await this.likedMovieService.getLikedMovies(
      user.sub,
      page || 1,
    );
    return {
      statusCode: 200,
      message: 'Liked movies fetched successfully',
      data: {
        movies: response.movies,
        page: page || 1,
        totalPages: response.totalPages,
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async likeMovie(@Body() body: { movieId: string }, @Req() request: Request) {
    try {
      const user = request['user'];

      const movie = await this.likedMovieService.likeMovie(
        user.sub,
        body.movieId,
      );

      if (movie == null) {
        return {
          statusCode: 200,
          message: 'Movie unliked successfully',
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: 'Movie liked successfully',
        data: movie,
      };
    } catch (err) {
      if (err instanceof LikedVideoException) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestException('Invalid movie id');
      }
    }
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async checkMovie(@Query('movieId') movieId: string, @Req() request: Request) {
    const user = request['user'];
    const response = await this.likedMovieService.checkMovie(movieId, user.sub);
    return {
      statusCode: 200,
      message: 'Movie checked successfully',
      data: response,
    };
  }
}

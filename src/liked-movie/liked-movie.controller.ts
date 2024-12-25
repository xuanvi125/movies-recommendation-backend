import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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
}

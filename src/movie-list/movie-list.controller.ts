import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { CreateMovieListRequestDTO } from './dto/CreateMovieListRequestDTO';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { MovieListException } from 'src/exceptions/MovieListException';

@Controller('movie-list')
export class MovieListController {
  constructor(private readonly movieListService: MovieListService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createMovieList(
    @Body() createMovieListRequestDTO: CreateMovieListRequestDTO,
    @Req() request: Request,
  ) {
    const payload = request['user'];
    const movieList = await this.movieListService.createMovieList(
      payload.sub,
      createMovieListRequestDTO,
    );
    return {
      statusCode: 201,
      message: 'Movie list created successfully',
      data: movieList,
    };
  }

  @Post(':id/movies')
  @UseGuards(AuthGuard)
  async addMovieToMovieList(
    @Body() body: { movieId: string },
    @Req() request: Request,
    @Param('id') movieListId: string,
  ) {
    try {
      const payload = request['user'];
      const movieList = await this.movieListService.addMovieToMovieList(
        payload.sub,
        movieListId,
        body.movieId,
      );
      return {
        statusCode: 200,
        message: 'Movie added to movie list successfully',
        data: movieList,
      };
    } catch (e) {
      if (e instanceof MovieListException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMovieLists(@Req() request: Request) {
    const payload = request['user'];
    const movieLists = await this.movieListService.getMovieLists(payload.sub);
    return {
      statusCode: 200,
      message: 'Movie lists retrieved successfully',
      data: movieLists,
    };
  }

  @Get(':id/movies')
  @UseGuards(AuthGuard)
  async getMoviesInMovieList(
    @Req() request: Request,
    @Param('id') movieListId: string,
  ) {
    try {
      const payload = request['user'];
      const movieList = await this.movieListService.getMoviesInMovieList(
        payload.sub,
        movieListId,
      );
      return {
        statusCode: 200,
        message: 'Movies in movie list retrieved successfully',
        data: movieList,
      };
    } catch (e) {
      if (e instanceof MovieListException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async shareMovieList(
    @Req() request: Request,
    @Param('id') movieListId: string,
  ) {
    try {
      const payload = request['user'];
      const shareUrl = await this.movieListService.shareMovieList(
        payload.sub,
        movieListId,
      );
      return {
        statusCode: 200,
        message: 'Movie list shared successfully',
        data: { shareUrl },
      };
    } catch (e) {
      if (e instanceof MovieListException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Get('shared/:shareId')
  async getSharedMovieList(@Param('shareId') shareId: string) {
    try {
      const movieList = await this.movieListService.getSharedMovieList(shareId);
      return {
        statusCode: 200,
        message: 'Shared movie list retrieved successfully',
        data: movieList,
      };
    } catch (e) {
      if (e instanceof MovieListException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}

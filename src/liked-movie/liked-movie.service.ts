import { Injectable } from '@nestjs/common';
import { LikedMovie } from './schemas/liked-movie.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { MovieService } from 'src/movie/movie.service';
import { LikedVideoException } from 'src/exceptions/LikedVideoException';

@Injectable()
export class LikedMovieService {
  constructor(
    @InjectModel(LikedMovie.name)
    private likedMovieModel: Model<LikedMovie>,
    private userService: UserService,
    private movieService: MovieService,
  ) {}
  async likeMovie(email: string, movieId: string) {
    const user = await this.userService.findByEmail(email);
    const movie = await this.movieService.getMovieById(movieId);

    if (movie == null) {
      throw new LikedVideoException('Movie not found');
    }

    const likedMovie = await this.likedMovieModel.findOne({
      userId: user._id,
      movieId,
    });

    if (likedMovie) {
      await this.likedMovieModel.deleteOne({ _id: likedMovie._id });
      return null;
    }

    return this.likedMovieModel.create({ userId: user._id, movieId });
  }

  async getLikedMovies(userId: string, page: number, limit: number) {
    const user = await this.userService.findByEmail(userId);

    const totalMovies = await this.likedMovieModel.countDocuments({
      userId: user._id,
    });
    const totalPages = Math.ceil(totalMovies / limit);

    const movies = await this.likedMovieModel
      .find({ userId: user._id })
      .populate('movieId')
      .skip((page - 1) * limit)
      .limit(limit);

    return { movies, totalPages };
  }

  async checkMovie(movieId: string, email: string) {
    const user = await this.userService.findByEmail(email);
    const movie = await this.movieService.getMovieById(movieId);

    if (movie == null) {
      throw new LikedVideoException('Movie not found');
    }

    const likedMovie = await this.likedMovieModel.findOne({
      userId: user._id,
      movieId,
    });

    return likedMovie != null;
  }
}

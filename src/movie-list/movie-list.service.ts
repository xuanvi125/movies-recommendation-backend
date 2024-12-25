import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MovieList } from './schemas/movie-list.schema';
import { Model } from 'mongoose';
import { CreateMovieListRequestDTO } from './dto/CreateMovieListRequestDTO';
import { UserService } from 'src/user/user.service';
import { MovieListException } from 'src/exceptions/MovieListException';
import { MovieService } from 'src/movie/movie.service';
import { nanoid } from 'nanoid';

@Injectable()
export class MovieListService {
  constructor(
    @InjectModel(MovieList.name) private movieListModel: Model<MovieList>,
    private userService: UserService,
    private movieService: MovieService,
  ) {}

  async createMovieList(
    email: string,
    createMovieListRequestDTO: CreateMovieListRequestDTO,
  ) {
    const user = await this.userService.findByEmail(email);
    const movieList = new this.movieListModel(createMovieListRequestDTO);
    movieList.userId = user._id;
    await movieList.save();
    return movieList;
  }

  async addMovieToMovieList(
    email: string,
    movieListId: string,
    movieId: string,
  ) {
    const user = await this.userService.findByEmail(email);
    const movieList = await this.movieListModel.findOne({
      _id: movieListId,
      userId: user._id,
    });

    if (!movieList) {
      throw new MovieListException(
        'Movie list not found or does not belong to user',
      );
    }

    const movie = await this.movieService.getMovieById(movieId);

    if (!movie) {
      throw new MovieListException('Movie not found');
    }

    if (movieList.movies.includes(movie._id)) {
      throw new MovieListException('Movie already in movie list');
    }

    movieList.movies.push(movie._id);
    await movieList.save();
    return movieList;
  }

  async getMovieLists(email: string) {
    const user = await this.userService.findByEmail(email);
    return this.movieListModel.find({ userId: user._id });
  }

  async getMoviesInMovieList(email: string, movieListId: string) {
    const user = await this.userService.findByEmail(email);
    const movies = this.movieListModel
      .findOne({
        _id: movieListId,
        userId: user._id,
      })
      .populate('movies');
    if (!movies) {
      throw new MovieListException(
        'Movie list not found or does not belong to user',
      );
    }
    return movies;
  }

  async shareMovieList(email: string, movieListId: string) {
    const user = await this.userService.findByEmail(email);
    const movieList = await this.movieListModel.findOne({
      _id: movieListId,
      userId: user._id,
    });

    if (!movieList) {
      throw new MovieListException(
        'Movie list not found or does not belong to user',
      );
    }

    if (!movieList.isPublic) {
      movieList.isPublic = true;
      movieList.sharedUrl = nanoid(10);
      await movieList.save();
    }
    return `${process.env.BASE_URL}/movie-list/shared/${movieList.sharedUrl}`;
  }

  async getSharedMovieList(sharedUrl: string) {
    const moviesList = await this.movieListModel
      .findOne({
        sharedUrl,
        isPublic: true,
      })
      .populate('movies');

    if (!moviesList) {
      throw new MovieListException('Shared movie list not found');
    }
    return moviesList;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { Model, Types } from 'mongoose';
import { MovieFilterRequestDTO } from './dto/MovieFilterRequestDTO';
import { ApiFeature } from 'src/utils/ApiFeature';

const API_KEY = process.env.TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<Movie>) {}
  async getTrendingMovies(day: string) {
    const url = `${API_URL}/trending/movie/${day}?api_key=${API_KEY}`;
    const response = await fetch(url);
    return await response.json();
  }

  async searchMovies(query: string) {
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&${query}`;
    const response = await fetch(url);
    return await response.json();
  }

  async getMovieCredits(id: string) {
    const url = `${API_URL}/movie/${id}/credits?api_key=${API_KEY}`;
    const response = await fetch(url);
    return await response.json();
  }
  async getMovieById(id: string) {
    const movie = await this.movieModel.findById(id);
    return movie;
  }

  async getMovies(query: MovieFilterRequestDTO) {
    //TODO: implement filter by trending movies

    const apiFeature = await new ApiFeature(this.movieModel.find(), query)
      .search('title')
      .filter()
      .sort()
      .paginate();

    const movies = await apiFeature.query;

    return {
      page: apiFeature.page,
      totalPages: apiFeature.totalPages,
      data: movies,
    };
  }
}

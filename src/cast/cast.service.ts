import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cast } from './schema/cast.schema';
import { Model } from 'mongoose';
import { SearchCastRequestDTO } from './dto/SearchCastRequestDTO';
import { ApiFeature } from 'src/utils/ApiFeature';
import { Movie } from 'src/movie/schemas/movie.schema';

@Injectable()
export class CastService {
  constructor(
    @InjectModel(Cast.name) private castModel: Model<Cast>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}
  async findById(id: number) {
    const data = await this.castModel.findOne({ tmdb_id: id });
    return data;
  }

  async search(query: SearchCastRequestDTO) {
    const apiFeature = await new ApiFeature(this.castModel.find(), query)
      .search('name')
      .paginate();

    const casts = await apiFeature.query;

    return {
      page: apiFeature.page,
      totalPages: apiFeature.totalPages,
      data: casts,
    };
  }

  async getMovies(id: string, page: number, limit: number) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const movies = await this.movieModel.aggregate([
      { $unwind: '$credits.cast' },
      { $match: { 'credits.cast.id': Number(id) } },
      {
        $project: {
          title: 1,
          poster_path: 1,
          release_date: 1,
          vote_average: 1,
        },
      },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
    ]);

    return movies;
  }
}

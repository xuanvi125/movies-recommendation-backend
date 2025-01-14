import { Injectable } from '@nestjs/common';
import { Rating } from './schema/rating.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRatingRequestDTO } from './dto/CreateRatingRequestDTO';

import { UserService } from 'src/user/user.service';
import { MovieService } from 'src/movie/movie.service';
import DocumentNotFoundException from 'src/exceptions/DocumentNotFoundException';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    private readonly userService: UserService,
    private readonly movieService: MovieService,
  ) {}

  async rateMovie(
    email: string,
    createRatingRequestDTO: CreateRatingRequestDTO,
  ) {
    const user = await this.userService.findByEmail(email);
    const movie = await this.movieService.getMovieById(
      createRatingRequestDTO.movieId,
    );

    if (!movie) {
      throw new DocumentNotFoundException('Movie not found');
    }
    const rating = await this.ratingModel.findOne({
      userId: user._id,
      movieId: createRatingRequestDTO.movieId,
    });

    if (rating) {
      await this.ratingModel.findOneAndUpdate(
        { _id: rating._id },
        { rating: createRatingRequestDTO.rating },
        { new: true },
      );
    } else {
      await this.ratingModel.create({
        ...createRatingRequestDTO,
        userId: user._id,
      });
    }

    const ratings = await this.getRatingsByMovieId(
      createRatingRequestDTO.movieId,
    );
    return await this.movieService.updateRating(movie._id, ratings);
  }
  async getRatingsByMovieId(movieId: string) {
    return await this.ratingModel.find({ movieId });
  }
}

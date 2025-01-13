import { Injectable } from "@nestjs/common";
import { Favorite } from "./schemas/favorite.schema";
import { UserService } from "src/user/user.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VoteMovieException } from "src/exceptions/VoteMovieException";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name)
    private favoriteModel: Model<Favorite>,
    private userService: UserService,
  ) {}
  async addFavoriteMovie(email: string, movieId: string) {
    const user = await this.userService.findByEmail(email);
    const favoriteMovie = await this.favoriteModel.findOne({
      userId: user._id,
      movieId,
    });

    if (favoriteMovie) {
      await this.favoriteModel.deleteOne({ _id: favoriteMovie._id });
      return null;
    }

    return this.favoriteModel.create({ userId: user._id, movieId });
  }
  
  async getMyFavoriteMovies(email: string, page: number) {
    const user = await this.userService.findByEmail(email);

    const totalMovies = await this.favoriteModel.countDocuments({
      userId: user._id,
    });
    const totalPages = Math.ceil(totalMovies / 10);

    const movies = await this.favoriteModel
      .find({ userId: user._id })
      .populate('movieId')
      .skip((page - 1) * 10)
      .limit(10);

    return { movies, totalPages };
  }
  async getFavoriteStatusOfMovie(email: string, movieId: string) {
    const user = await this.userService.findByEmail(email);
    const favoriteMovie = await this.favoriteModel.findOne({
      userId: user._id,
      movieId,
    });
    return !!favoriteMovie;
  }
}
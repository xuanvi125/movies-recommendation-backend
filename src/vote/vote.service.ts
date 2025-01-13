import { Injectable } from "@nestjs/common";
import { Vote } from "./schemas/vote.schema";
import { UserService } from "src/user/user.service";
import { InjectModel } from "@nestjs/mongoose";
import { VoteDTO } from "./dto/VoteDTO";
import { Model } from "mongoose";
import { VoteMovieException } from "src/exceptions/VoteMovieException";

@Injectable()
export class VoteService {
  constructor(
    @InjectModel(Vote.name)
    private voteModel: Model<Vote>,
    private userService: UserService,
  ) {}
  async voteMovie(email: string, voteDTO: VoteDTO) {
    const user = await this.userService.findByEmail(email);
    const voteMovie = await this.voteModel.findOne({
      userId: user._id,
      movieId: voteDTO.movieId,
    })
    
    if (voteMovie) {
      throw new VoteMovieException('You have already voted for this movie');
    }
    return this.voteModel.create({ userId: user._id, movieId: voteDTO.movieId, vote: voteDTO.vote });
  }
  
  async getVoteMovies(email: string, page: number) {
    const user = await this.userService.findByEmail(email);

    const totalMovies = await this.voteModel.countDocuments({
      userId: user._id,
    });
    const totalPages = Math.ceil(totalMovies / 10);

    const movies = await this.voteModel
      .find({ userId: user._id })
      .populate('movieId')
      .skip((page - 1) * 10)
      .limit(10);

    return { movies, totalPages };
  }
  
  async getMovieVoteStatus(movieId: string) {
    const stats = await this.voteModel.aggregate([
      { $match: { movieId } },
      {
        $group: {
          _id: '$movieId',
          vote_count: { $sum: 1 }, 
          vote_average: { $avg: '$vote' }, 
        },
      },
    ]);

    if (!stats.length) {
      return { movieId, vote_count: 0, vote_average: 0 };
    }

    return {
      movieId: stats[0]._id,
      vote_count: stats[0].vote_count,
      vote_average: stats[0].vote_average.toFixed(2),
    };
  }
}
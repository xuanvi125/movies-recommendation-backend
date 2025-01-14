import { Injectable } from "@nestjs/common";
import { Comment } from "./schemas/comment.schema";
import { UserService } from "src/user/user.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    private userService: UserService,
  ) {}
  async addComment(email: string, movieId: string, comment: string, ) {
    const user = await this.userService.findByEmail(email);
    return this.commentModel.create({ userId: user._id, movieId: movieId, content: comment });
  }
  
  async getComments(email: string, movieId: string, page: number) {
    const user = await this.userService.findByEmail(email);

    const totalComment = await this.commentModel.countDocuments({
      userId: user._id,
    });
    const totalPages = Math.ceil(totalComment / 10);

    const comments = await this.commentModel
      .find({ userId: user._id, movieId: movieId })
      .skip((page - 1) * 10)
      .select('-movieId') 
      .limit(10);
    return { comments, totalPages };
  }
}
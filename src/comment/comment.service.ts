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
  async addComment(email: string, movieId: string, comment: string) {
    const user = await this.userService.findByEmail(email);
    return this.commentModel.create({ userId: user._id, movieId: movieId, content: comment});
  }
  
  async getComments(movieId: string) {
    const comments = await this.commentModel
    .find({ movieId: movieId })
    .select('-movieId') 
    .populate({ path: 'userId', select: 'email' })
    .sort({ createdAt: -1 }) 
    .lean();
  
    const now = new Date();
  
    const formattedComments = comments.map(comment => {
      const createdAt = new Date(comment.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
  
      let timeAgo = `${diffSeconds} seconds ago`;
      if (diffSeconds > 60) {
        const diffMinutes = Math.floor(diffSeconds / 60);
        timeAgo = `${diffMinutes} minutes ago`;
        if (diffMinutes > 60) {
          const diffHours = Math.floor(diffMinutes / 60);
          timeAgo = `${diffHours} hours ago`;
          if (diffHours > 24) {
            const diffDays = Math.floor(diffHours / 24);
            timeAgo = `${diffDays} days ago`;
          }
        }
      }
  
      return {
        ...comment,
        timeAgo, 
      };
    });
  
    return { comments: formattedComments };
  }

  
}
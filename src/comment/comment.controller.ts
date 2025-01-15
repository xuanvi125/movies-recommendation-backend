import {
  BadRequestException,
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async addComment(
    @Req() request: Request,
    @Body() body: { movieId: string; content: string },
  ) {
    const user = request['user'];

    const comment = await this.commentService.addComment(
      user.sub,
      body.movieId,
      body.content,
    );
    return {
      statusCode: 200,
      message: 'Add comment to movie successfully',
      data: comment,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getComments(
    @Req() request: Request,
    @Query('movieId') movieId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1,
  ) {
    const response = await this.commentService.getComments(movieId);

    return {
      statusCode: 200,
      message: 'Get all comments successfully',
      data: {
        comments: response.comments,
        totalPages: response.totalPages,
      },
    };
  }
}

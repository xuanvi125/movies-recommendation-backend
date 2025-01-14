
import { BadRequestException, Body, Catch, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/common/guards/auth.guard";
@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}
	
	@Post('add')
  	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async addComment(@Req() request: Request, @Body() body: {movieId: string, comment: string}) {
		const user = request['user'];
		const comment = await this.commentService.addComment(user.sub, body.movieId, body.comment);
		return {
			statusCode: 200,
			message: 'Vote movie successfully',
			data: comment,
		};
	} 
	
	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getComments(@Req() request: Request, @Query('movieId') movieId: string, @Query('page') page: number) {
		const user = request['user'];
		const response = await this.commentService.getComments(
			user.sub,
			movieId,
			page || 1,
		);
		return {
			statusCode: 200,
			message: 'Liked movies fetched successfully',
			data: {
				movies: response.comments,
				page: page || 1,
				totalPages: response.totalPages,
			},
		};
	}
}
import { BadRequestException, Body, Catch, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { VoteDTO } from "./dto/VoteDTO";

@Controller('vote')
export class VoteController {
	constructor(private readonly voteService: VoteService) {}
	
	@Post()
  	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async voteMovie(@Req() request: Request, @Body() voteDTO: VoteDTO) {
		try {
			const user = request['user'];
			const vote = await this.voteService.voteMovie(user.sub, voteDTO);
			return {
				statusCode: 200,
				message: 'Vote movie successfully',
				data: vote,
			};
		}catch(err) {
			throw new BadRequestException(err.message);
		}
	} 
	
	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getVotedMovies(@Req() request: Request, @Query('page') page: number) {
		const user = request['user'];
		const response = await this.voteService.getVoteMovies(
			user.sub,
			page || 1,
		);
		return {
			statusCode: 200,
			message: 'Liked movies fetched successfully',
			data: {
				movies: response.movies,
				page: page || 1,
				totalPages: response.totalPages,
			},
		};
	}
}
import { BadRequestException, Body, Catch, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller('favorite')
export class FavoriteController {
	constructor(private readonly favoriteService: FavoriteService) {}
	
	@Post()
  	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async toggleFavoriteMovie(@Req() request: Request, @Body() body: { movieId: string }) {
		const user = request['user'];
		const movie = await this.favoriteService.addFavoriteMovie(user.sub, body.movieId);
		if (movie == null) {
			return {
				statusCode: 200,
				message: 'Removed movie from favorites successfully',
				data: null,
			};
		}
		return {
			statusCode: 200,
			message: 'Added movie to favorites successfully',
			data: movie,
		};
	} 
	
	@Get("my-list")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getMyFavoriteMovies(@Req() request: Request, @Query('page') page: number) {
		const user = request['user'];
		const response = await this.favoriteService.getMyFavoriteMovies(
			user.sub,
			page || 1,
		);
		return {
			statusCode: 200,
			message: 'Favorite movies fetched successfully',
			data: {
				movies: response.movies,
				page: page || 1,
				totalPages: response.totalPages,
			},
		};
	}
	
	@Get("movie/:movieId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async getFavoriteStatusOfMovie(@Req() request: Request, @Param('movieId') movieId: string) {
		const user = request['user'];
		const isFavorite = await this.favoriteService.getFavoriteStatusOfMovie(user.sub, movieId);
		
		return {
			statusCode: 200,
			message: 'Favorite status of movie fetched successfully',
			data: {
				movieId: movieId,
				isFavorite: isFavorite,
			},
		};
	}
}
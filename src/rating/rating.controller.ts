import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateRatingRequestDTO } from './dto/CreateRatingRequestDTO';
import { Request } from 'express';

@Controller('/movies/rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(AuthGuard)
  async rateMovie(
    @Req() request: Request,
    @Body() createRatingRequestDTO: CreateRatingRequestDTO,
  ) {
    try {
      const payload = request['user'];
      const result = await this.ratingService.rateMovie(
        payload.sub,
        createRatingRequestDTO,
      );
      return {
        statusCode: 201,
        message: 'Movie rated successfully',
        data: result,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

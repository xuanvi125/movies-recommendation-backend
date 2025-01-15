import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDTO } from './dto/SignUpDTO';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from 'express';
import EmailAlreadyExistsException from 'src/exceptions/EmailAlreadyExistsException';
import { RatingService } from 'src/rating/rating.service';
import { Rating } from 'src/rating/schema/rating.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller('users')
export class UserController {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async create(@Body() signUpDTO: SignUpDTO) {
    try {
      const user = await this.userService.create(signUpDTO);
      return {
        statusCode: 201,
        message: 'User created successfully',
        data: user,
      };
    } catch (err) {
      if (err instanceof EmailAlreadyExistsException) {
        throw new BadRequestException('Email already exists');
      }
    }
  }
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() request: Request) {
    const user = request['user'];
    const profile = await this.userService.getProfile(user.sub);
    return {
      statusCode: 200,
      message: 'Get profile successfully',
      user: profile,
    };
  }

  @Get('ratings')
  @UseGuards(AuthGuard)
  async getRatings(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const payload = request['user'];
    const user = await this.userService.findByEmail(payload.sub);

    const totalRatings = await this.ratingModel.countDocuments({
      userId: user._id,
    });

    const totalPages = Math.ceil(totalRatings / limit);
    const ratings = await this.ratingModel
      .find({ userId: user._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('movieId');
    return {
      statusCode: 200,
      message: 'Ratings fetched successfully',
      data: {
        result: ratings,
        totalPages,
      },
    };
  }

  @Get('movies/:movieId/rating')
  @UseGuards(AuthGuard)
  async getRatingByMovieId(
    @Req() request: Request,
    @Param('movieId') movieId: string,
  ) {
    const payload = request['user'];
    const user = await this.userService.findByEmail(payload.sub);

    const rating = await this.ratingModel.findOne({
      userId: user._id,
      movieId,
    });

    if (!rating) {
      throw new BadRequestException('Rating not found');
    }

    return {
      statusCode: 200,
      message: 'Rating fetched successfully',
      data: rating,
    };
  }
}

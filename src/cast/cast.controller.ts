import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CastService } from './cast.service';
import { SearchCastRequestDTO } from './dto/SearchCastRequestDTO';
import { ApiFeature } from 'src/utils/ApiFeature';

@Controller('casts')
export class CastController {
  constructor(private castService: CastService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cast = await this.castService.findById(Number(id));
    if (!cast) {
      throw new NotFoundException(`Cast with id ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Cast fetched successfully',
      data: cast,
    };
  }
  @Get()
  async search(@Query() query: SearchCastRequestDTO) {
    const result = await this.castService.search(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Casts fetched successfully',
      data: result,
    };
  }

  @Get(':id/movies')
  async getMovies(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const result = await this.castService.getMovies(id, page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: 'Movies fetched successfully',
      data: result,
    };
  }
}

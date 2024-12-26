import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CastService } from './cast.service';

@Controller('casts')
export class CastController {
  constructor(private castService: CastService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cast = await this.castService.findById(id);
    if (!cast) {
      throw new NotFoundException(`Cast with id ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Cast fetched successfully',
      data: cast,
    };
  }
}

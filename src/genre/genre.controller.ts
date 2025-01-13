import { Controller, Get, Query } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreFilterRequestDTO } from './dto/GenreFilterRequestDTO';

@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    async getAllGenre(@Query() query: GenreFilterRequestDTO) {
        const result = await this.genreService.getAllGenre(query);
        return {
            statusCode: 200,
            message: 'Movies fetched successfully',
            data: result,
          };
    }

}

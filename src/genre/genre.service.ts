import { Injectable } from '@nestjs/common';
import { Genre } from './schema/genre.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ApiFeature } from 'src/utils/ApiFeature';
import { GenreFilterRequestDTO } from './dto/GenreFilterRequestDTO';

@Injectable()
export class GenreService {
    constructor(@InjectModel(Genre.name) private genreModel: Model<Genre>) {}
    async getAllGenre(query : GenreFilterRequestDTO){
        const apiFeature = await new ApiFeature(this.genreModel.find(), query).paginate();
        const genres = await apiFeature.query;
        
        return {
        page: apiFeature.page,
        totalPages: apiFeature.totalPages,
        data: genres,
        };
    }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cast } from './schema/cast.schema';
import { Model } from 'mongoose';
import { SearchCastRequestDTO } from './dto/SearchCastRequestDTO';
import { ApiFeature } from 'src/utils/ApiFeature';

@Injectable()
export class CastService {
  constructor(@InjectModel(Cast.name) private castModel: Model<Cast>) {}
  async findById(id: number) {
    const data = await this.castModel.findOne({tmdb_id: id});
    return data;
  }

  async search(query: SearchCastRequestDTO) {
    const apiFeature = await new ApiFeature(this.castModel.find(), query)
      .search('name')
      .paginate();

    const casts = await apiFeature.query;

    return {
      page: apiFeature.page,
      totalPages: apiFeature.totalPages,
      data: casts,
    };
  }
}

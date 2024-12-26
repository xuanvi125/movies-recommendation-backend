import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cast } from './schema/cast.schema';
import { Model } from 'mongoose';

@Injectable()
export class CastService {
  constructor(@InjectModel(Cast.name) private castModel: Model<Cast>) {}
  async findById(id: string) {
    return await this.castModel.findById(id);
  }
}

import { Module } from '@nestjs/common';
import { CastService } from './cast.service';
import { CastController } from './cast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CastSchema } from './schema/cast.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cast', schema: CastSchema }])],
  providers: [CastService],
  controllers: [CastController],
})
export class CastModule {}

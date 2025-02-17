import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, BackendService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

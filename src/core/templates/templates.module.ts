import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, BackendService],
  exports: [TemplatesService],
})
export class TemplatesModule {}

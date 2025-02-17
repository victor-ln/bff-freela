import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [ServicesController],
  providers: [ServicesService, BackendService],
  exports: [ServicesService],
})
export class ServicesModule {}

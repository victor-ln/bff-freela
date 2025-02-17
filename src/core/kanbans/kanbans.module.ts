import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KanbansService } from './kanbans.service';
import { KanbansController } from './kanbans.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [KanbansController],
  providers: [KanbansService, BackendService],
  exports: [KanbansService],
})
export class KanbansModule {}

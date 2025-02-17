import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [ProposalsController],
  providers: [ProposalsService, BackendService],
  exports: [ProposalsService],
})
export class ProposalsModule {}

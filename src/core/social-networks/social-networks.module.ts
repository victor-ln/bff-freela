import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocialNetworksService } from './social-networks.service';
import { SocialNetworksController } from './social-networks.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [SocialNetworksController],
  providers: [SocialNetworksService, BackendService],
  exports: [SocialNetworksService],
})
export class SocialNetworksModule {}

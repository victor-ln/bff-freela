import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocialNetworksTypesService } from './social-networks-types.service';
import { SocialNetworksTypesController } from './social-networks-types.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [SocialNetworksTypesController],
  providers: [SocialNetworksTypesService, BackendService],
  exports: [SocialNetworksTypesService],
})
export class SocialNetworksTypesModule {}

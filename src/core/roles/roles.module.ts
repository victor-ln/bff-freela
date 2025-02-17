import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [RolesController],
  providers: [RolesService, BackendService],
  exports: [RolesService],
})
export class RolesModule {}

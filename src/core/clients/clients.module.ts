import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [ClientsController],
  providers: [ClientsService, BackendService],
  exports: [ClientsService],
})
export class ClientsModule {}

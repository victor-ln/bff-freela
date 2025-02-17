import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [HttpModule],
  controllers: [FreelancersController],
  providers: [FreelancersService, BackendService],
  exports: [FreelancersService],
})
export class FreelancersModule {}

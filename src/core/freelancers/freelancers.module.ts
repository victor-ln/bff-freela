import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { BackendService } from '../../common/http/backend.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [FreelancersController],
  providers: [FreelancersService, BackendService],
  exports: [FreelancersService],
})
export class FreelancersModule {}

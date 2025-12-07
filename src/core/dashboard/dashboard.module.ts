import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { BackendService } from '../../common/http/backend.service';

@Module({
  imports: [
    HttpModule,   // Fornece o HttpService usado pelo BackendService
    ConfigModule, // Fornece o ConfigService usado pelo BackendService
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    BackendService // <--- Adicione o BackendService aqui para que ele possa ser injetado
  ],
})
export class DashboardModule {}
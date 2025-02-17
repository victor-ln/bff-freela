import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core modules
import { FreelancersModule } from './core/freelancers/freelancers.module';
import { ClientsModule } from './core/clients/clients.module';
import { RolesModule } from './core/roles/roles.module';
import { CategoriesModule } from './core/categories/categories.module';
import { KanbansModule } from './core/kanbans/kanbans.module';
import { ProposalsModule } from './core/proposals/proposals.module';
import { SocialNetworksModule } from './core/social-networks/social-networks.module';
import { SocialNetworksTypesModule } from './core/social-networks-types/social-networks-types.module';
import { TemplatesModule } from './core/templates/templates.module';

// Auth module
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';

// Common services
import { BackendService } from './common/http/backend.service';
import { RolesGuard } from './auth/guards/roles/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
      max: 100, // maximum number of items in cache
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    
    // Auth module
    AuthModule,
    
    // Core modules
    FreelancersModule,
    ClientsModule,
    RolesModule,
    CategoriesModule,
    KanbansModule,
    ProposalsModule,
    SocialNetworksModule,
    SocialNetworksTypesModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BackendService,
    // Guards globais 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FreelancersModule } from 'src/core/freelancers/freelancers.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAdapter } from './adapters/jwt.adapter';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';

@Module({
  imports: [
    FreelancersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtAdapter,
    BcryptAdapter,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [
    JwtAdapter, 
    BcryptAdapter, 
    JwtAuthGuard, 
    RolesGuard,
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}
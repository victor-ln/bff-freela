import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { FreelancersService } from '../../core/freelancers/freelancers.service';
import { Role } from '../roles/roles.enum';

export interface JwtPayload {
  sub: number;
  username: string;
  roles?: Role[];
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: number;
  username: string;
  roles: Role[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly freelancersService: FreelancersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    try {
      // Buscar o usuário no backend usando Observable convertido para Promise
      const user = await lastValueFrom(
        this.freelancersService.findById(payload.sub)
      );
      
      if (!user) {
        throw new UnauthorizedException('Token inválido - usuário não encontrado');
      }

      // Verificar se o usuário ainda está ativo
      if (!user.isActive) {
        throw new UnauthorizedException('Usuário inativo');
      }

      return {
        userId: payload.sub,
        username: payload.username,
        roles: user.roles || [Role.FREELANCER], // Default role
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Erro na validação do JWT:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
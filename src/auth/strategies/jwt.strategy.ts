import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { FreelancersService } from '../../core/freelancers/freelancers.service';
import { Role } from '../roles/roles.enum';

/**
 * Payload do JWT
 */
export interface JwtPayload {
  sub: number;      // freelancer.id (É o userId)
  username: string; // Nome do freelancer
  email?: string;   // Email do freelancer
  iat?: number;     // Issued at
  exp?: number;     // Expiration
}

/**
 * Usuário autenticado
 * 
 * IMPORTANTE: userId É o freelancer.id (não há separação)
 */
export interface AuthenticatedUser {
  userId: number;   // É o freelancer.id
  username: string; // Nome do freelancer
  roles: Role[];    // Roles/permissões do freelancer
}

/**
 * JWT Strategy para validação de tokens
 * 
 * IMPORTANTE:
 * - payload.sub contém o freelancer.id (que É o userId)
 * - Busca o freelancer no backend para validar se ainda existe e está ativo
 * - Retorna AuthenticatedUser que será injetado nas rotas protegidas
 */
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

  /**
   * Valida o token JWT e retorna o usuário autenticado
   * 
   * @param payload - Payload decodificado do JWT
   * @returns Dados do usuário autenticado para uso nas rotas
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    try {
      // payload.sub É o freelancer.id (que É o userId)
      const freelancer = await lastValueFrom(
        this.freelancersService.findById(payload.sub)
      );
      
      // Valida se o freelancer ainda existe
      if (!freelancer) {
        throw new UnauthorizedException('Token inválido - freelancer não encontrado');
      }

      // Valida se o freelancer ainda está ativo
      if (!freelancer.ativo) {
        throw new UnauthorizedException('Freelancer inativo');
      }

      // Retorna dados do usuário autenticado
      // IMPORTANTE: userId É o freelancer.id (não há separação)
      return {
        userId: freelancer.id, // freelancer.id É o userId
        username: freelancer.nome,
        roles: freelancer.roles || [Role.FREELANCER], // Role padrão se não houver
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
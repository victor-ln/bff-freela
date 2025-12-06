import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FreelancersService } from '../core/freelancers/freelancers.service';
import { JwtAdapter } from './adapters/jwt.adapter';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: JwtAdapter,
    private readonly passwordService: BcryptAdapter,
    private readonly freelancersService: FreelancersService,
  ) {}

  /**
   * Realiza o login do freelancer
   * 
   * @param username - Email do freelancer (usado como username)
   * @param pass - Senha em texto plano (será comparada com o hash)
   * @returns Token JWT de acesso
   */
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    // Busca freelancer por email (username = email)
    const freelancer = await lastValueFrom(
      this.freelancersService.findByUsername(username)
    );
    
    // Valida credenciais
    if (!freelancer || !this.passwordService.compare(pass, freelancer.?senha)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica se o freelancer está ativo
    if (!freelancer.ativo) {
      throw new UnauthorizedException('Conta inativa. Entre em contato com o suporte.');
    }

    // Gera JWT com dados do freelancer
    // IMPORTANTE: sub é o freelancer.id (que É o userId)
    const payload = { 
      sub: freelancer.id, // freelancer.id É o userId
      username: freelancer.nome,
      email: freelancer.email,
    };
    
    return {
      access_token: await this.tokenService.tokenizer(payload),
    };
  }
}
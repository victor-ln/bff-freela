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

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await lastValueFrom(
      this.freelancersService.findByUsername(username)
    );
    
    if (!user || !this.passwordService.compare(pass, user.senha)) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, username: user.nome };
    return {
      access_token: await this.tokenService.tokenizer(payload),
    };
  }
}
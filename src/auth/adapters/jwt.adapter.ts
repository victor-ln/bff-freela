import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenGateway, TokenType } from '../gateways/token.gateway';

@Injectable()
export class JwtAdapter implements TokenGateway {
  constructor(private readonly jwtService: JwtService) {}

  async tokenizer(payload: object): Promise<TokenType> {
    return await this.jwtService.signAsync(payload);
  }

  decoder<T = any>(token: TokenType): T {
    const tokenWithoutBearer = token.replace('Bearer ', '');

    return this.jwtService.decode(tokenWithoutBearer);
  }

  async validator<T extends object = any>(token: TokenType): Promise<T> {
    const tokenWithoutBearer = token.replace('Bearer ', '');
    return await this.jwtService.verifyAsync(tokenWithoutBearer);
  }
}
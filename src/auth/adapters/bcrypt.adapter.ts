import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { PasswordGateway } from '../gateways/password.gateway';

@Injectable()
export class BcryptAdapter implements PasswordGateway {
  private readonly saltRounds = 12;

  compare(plainPassword: string, encryptedPassword: string): boolean {
    return compareSync(plainPassword, encryptedPassword);
  }

  encrypt(plainPassword: string): string {
    return hashSync(plainPassword, this.saltRounds);
  }
}
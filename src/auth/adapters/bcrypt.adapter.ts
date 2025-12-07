import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter {
  private SALT_ROUNDS = 10;

  async encrypt(password: string): Promise<string> {
    // TEM QUE retornar o hash, não a senha original
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
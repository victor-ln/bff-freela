import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private backendUrl: string;

  constructor(private configService: ConfigService) {
    this.backendUrl = this.configService.get<string>('BACKEND_URL') ?? '';
  }

  async register(email: string, password: string) {
    try {
      await axios.post(`${this.backendUrl}/auth/register`, { email, password });
      return { message: 'Usuário registrado com sucesso' };
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${this.backendUrl}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }
}
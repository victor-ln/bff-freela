import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'FreelaFlow BFF',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }
}

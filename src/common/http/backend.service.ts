import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class BackendService {
  private readonly logger = new Logger(BackendService.name);
  private readonly backendUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.backendUrl = this.configService.getOrThrow<string>('BACKEND_URL');
  }

  get<T>(endpoint: string): Observable<T> {
    const url = `${this.backendUrl}${endpoint}`;
    this.logger.log(`GET request to: ${url}`);
    
    return this.httpService.get<T>(url).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.logger.error(`Error in GET ${url}:`, error.message);
        throw new HttpException(
          error.response?.data || 'Erro interno do servidor',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.backendUrl}${endpoint}`;
    this.logger.log(`POST request to: ${url}`);
    
    return this.httpService.post<T>(url, data).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.logger.error(`Error in POST ${url}:`, error.message);
        throw new HttpException(
          error.response?.data || 'Erro interno do servidor',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.backendUrl}${endpoint}`;
    this.logger.log(`PUT request to: ${url}`);
    
    return this.httpService.put<T>(url, data).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.logger.error(`Error in PUT ${url}:`, error.message);
        throw new HttpException(
          error.response?.data || 'Erro interno do servidor',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.backendUrl}${endpoint}`;
    this.logger.log(`PATCH request to: ${url}`);
    
    return this.httpService.patch<T>(url, data).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.logger.error(`Error in PATCH ${url}:`, error.message);
        throw new HttpException(
          error.response?.data || 'Erro interno do servidor',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.backendUrl}${endpoint}`;
    this.logger.log(`DELETE request to: ${url}`);
    
    return this.httpService.delete<T>(url).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.logger.error(`Error in DELETE ${url}:`, error.message);
        throw new HttpException(
          error.response?.data || 'Erro interno do servidor',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}

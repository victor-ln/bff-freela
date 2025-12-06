import { Injectable, Logger } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createClientDto: CreateClientDto): Observable<ClientResponseDto> {
    this.logger.log(`Creating new client: ${createClientDto.nomeRazaoSocial}`);
    return this.backendService.post<ClientResponseDto>('/clients', createClientDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<ClientResponseDto>> {
    this.logger.log(`Fetching clients with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<ClientResponseDto>>(`/clients?${queryParams}`);
  }

  findOne(id: number): Observable<ClientResponseDto> {
    this.logger.log(`Fetching client with id: ${id}`);
    return this.backendService.get<ClientResponseDto>(`/clients/${id}`);
  }

  update(id: number, updateClientDto: UpdateClientDto): Observable<ClientResponseDto> {
    this.logger.log(`Updating client with id: ${id}`);
    return this.backendService.put<ClientResponseDto>(`/clients/${id}`, updateClientDto);
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing client with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/clients/${id}`);
  }

  findByEmail(email: string): Observable<ClientResponseDto> {
    this.logger.log(`Finding client by email: ${email}`);
    const queryParams = new URLSearchParams({
      search: email,
      limit: '1',
    });
    return this.backendService.get<any>(`/clients?${queryParams}`)
      .pipe(
        map(response => {
          const data = response.dados?.data || [];
          if (data.length === 0) {
            throw new Error('Client not found');
          }
          return data[0];
        })
      );
  }

  findByCpfCnpj(cpfCnpj: string): Observable<ClientResponseDto> {
    this.logger.log(`Finding client by CPF/CNPJ: ${cpfCnpj}`);
    const queryParams = new URLSearchParams({
      search: cpfCnpj,
      limit: '1',
    });
    return this.backendService.get<any>(`/clients?${queryParams}`)
      .pipe(
        map(response => {
          const data = response.dados?.data || [];
          if (data.length === 0) {
            throw new Error('Client not found');
          }
          return data[0];
        })
      );
  }
}

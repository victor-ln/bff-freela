import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ServiceStatus } from './enums/service-status.enum';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createServiceDto: CreateServiceDto): Observable<ServiceResponseDto> {
    this.logger.log(`Creating new service: ${createServiceDto.nome}`);
    return this.backendService.post<ServiceResponseDto>('/services', createServiceDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<ServiceResponseDto>> {
    this.logger.log(`Fetching services with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<ServiceResponseDto>>(`/services?${queryParams}`);
  }

  findByStatus(status: ServiceStatus): Observable<ServiceResponseDto[]> {
    this.logger.log(`Fetching services by status: ${status}`);
    return this.backendService.get<ServiceResponseDto[]>(`/services/by-status/${status}`);
  }

  findActive(): Observable<ServiceResponseDto[]> {
    this.logger.log('Fetching active services');
    return this.backendService.get<ServiceResponseDto[]>('/services/active');
  }

  findByCategory(categoriaId: number): Observable<ServiceResponseDto[]> {
    this.logger.log(`Fetching services by category: ${categoriaId}`);
    return this.backendService.get<ServiceResponseDto[]>(`/services/category/${categoriaId}`);
  }

  findByPriceRange(minPrice: number, maxPrice: number): Observable<ServiceResponseDto[]> {
    this.logger.log(`Fetching services by price range: ${minPrice} - ${maxPrice}`);
    const queryParams = new URLSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    });
    return this.backendService.get<ServiceResponseDto[]>(`/services/price-range?${queryParams}`);
  }

  findOne(id: number): Observable<ServiceResponseDto> {
    this.logger.log(`Fetching service with id: ${id}`);
    return this.backendService.get<ServiceResponseDto>(`/services/${id}`);
  }

  update(id: number, updateServiceDto: UpdateServiceDto): Observable<ServiceResponseDto> {
    this.logger.log(`Updating service with id: ${id}`);
    return this.backendService.put<ServiceResponseDto>(`/services/${id}`, updateServiceDto);
  }

  toggleStatus(id: number, status: ServiceStatus): Observable<ServiceResponseDto> {
    this.logger.log(`Changing service ${id} status to: ${status}`);
    return this.backendService.patch<ServiceResponseDto>(`/services/${id}/status`, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing service with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/services/${id}`);
  }
}

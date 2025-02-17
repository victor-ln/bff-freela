import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateSocialNetworksTypeDto } from './dto/create-social-networks-type.dto';
import { UpdateSocialNetworksTypeDto } from './dto/update-social-networks-type.dto';
import { SocialNetworksTypeResponseDto } from './dto/social-networks-type-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SocialNetworksTypesService {
  private readonly logger = new Logger(SocialNetworksTypesService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createSocialNetworksTypeDto: CreateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    this.logger.log(`Creating new social networks type: ${createSocialNetworksTypeDto.tipo}`);
    return this.backendService.post<SocialNetworksTypeResponseDto>('/social-networks-types', createSocialNetworksTypeDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<SocialNetworksTypeResponseDto>> {
    this.logger.log(`Fetching social networks types with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<SocialNetworksTypeResponseDto>>(`/social-networks-types?${queryParams}`);
  }

  findAllActive(): Observable<SocialNetworksTypeResponseDto[]> {
    this.logger.log('Fetching all active social networks types');
    return this.backendService.get<SocialNetworksTypeResponseDto[]>('/social-networks-types/active');
  }

  findOne(id: number): Observable<SocialNetworksTypeResponseDto> {
    this.logger.log(`Fetching social networks type with id: ${id}`);
    return this.backendService.get<SocialNetworksTypeResponseDto>(`/social-networks-types/${id}`);
  }

  findByTipo(tipo: string): Observable<SocialNetworksTypeResponseDto> {
    this.logger.log(`Finding social networks type by tipo: ${tipo}`);
    return this.backendService.get<SocialNetworksTypeResponseDto>(`/social-networks-types/by-tipo/${tipo}`);
  }

  update(id: number, updateSocialNetworksTypeDto: UpdateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    this.logger.log(`Updating social networks type with id: ${id}`);
    return this.backendService.put<SocialNetworksTypeResponseDto>(`/social-networks-types/${id}`, updateSocialNetworksTypeDto);
  }

  toggleStatus(id: number, status: boolean): Observable<SocialNetworksTypeResponseDto> {
    this.logger.log(`${status ? 'Activating' : 'Deactivating'} social networks type with id: ${id}`);
    return this.backendService.patch<SocialNetworksTypeResponseDto>(`/social-networks-types/${id}/status`, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing social networks type with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/social-networks-types/${id}`);
  }
}

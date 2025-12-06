import { Injectable, Logger } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';
import { SocialNetworkResponseDto } from './dto/social-network-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SocialNetworksService {
  private readonly logger = new Logger(SocialNetworksService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createSocialNetworkDto: CreateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    this.logger.log(`Creating new social network: ${createSocialNetworkDto.nome} for client ${createSocialNetworkDto.clienteId}`);
    return this.backendService.post<SocialNetworkResponseDto>('/social-networks', createSocialNetworkDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<SocialNetworkResponseDto>> {
    this.logger.log(`Fetching social networks with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<SocialNetworkResponseDto>>(`/social-networks?${queryParams}`);
  }

  findByClient(clienteId: number): Observable<SocialNetworkResponseDto[]> {
    this.logger.log(`Fetching social networks for client: ${clienteId}`);
    const queryParams = new URLSearchParams({
      clienteId: clienteId.toString(),
      limit: '1000',
    });
    return this.backendService.get<any>(`/social-networks?${queryParams}`)
      .pipe(map(response => response.dados?.data || []));
  }

  findByType(tipoId: number): Observable<SocialNetworkResponseDto[]> {
    this.logger.log(`Fetching social networks by type: ${tipoId}`);
    const queryParams = new URLSearchParams({
      tipoId: tipoId.toString(),
      limit: '1000',
    });
    return this.backendService.get<any>(`/social-networks?${queryParams}`)
      .pipe(map(response => response.dados?.data || []));
  }

  findOne(id: number): Observable<SocialNetworkResponseDto> {
    this.logger.log(`Fetching social network with id: ${id}`);
    return this.backendService.get<SocialNetworkResponseDto>(`/social-networks/${id}`);
  }

  update(id: number, updateSocialNetworkDto: UpdateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    this.logger.log(`Updating social network with id: ${id}`);
    return this.backendService.put<SocialNetworkResponseDto>(`/social-networks/${id}`, updateSocialNetworkDto);
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing social network with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/social-networks/${id}`);
  }
}

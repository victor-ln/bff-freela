import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { FreelancerResponseDto } from './dto/freelancer-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Role } from 'src/auth/roles/roles.enum';

@Injectable()
export class FreelancersService {
  private readonly logger = new Logger(FreelancersService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createFreelancerDto: CreateFreelancerDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Creating new freelancer: ${createFreelancerDto.nome}`);
    return this.backendService.post<FreelancerResponseDto>('/freelancers', createFreelancerDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<FreelancerResponseDto>> {
    this.logger.log(`Fetching freelancers with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<FreelancerResponseDto>>(`/freelancers?${queryParams}`);
  }

  findOne(id: number): Observable<FreelancerResponseDto> {
    this.logger.log(`Fetching freelancer with id: ${id}`);
    return this.backendService.get<FreelancerResponseDto>(`/freelancers/${id}`);
  }

  findById(id: number): Observable<FreelancerResponseDto> {
    this.logger.log(`Finding freelancer by id: ${id}`);
    return this.backendService.get<FreelancerResponseDto>(`/freelancers/${id}`);
  }

  findByUsername(username: string): Observable<FreelancerResponseDto> {
    this.logger.log(`Finding freelancer by username: ${username}`);
    return this.backendService.get<FreelancerResponseDto>(`/freelancers/by-username/${username}`);
  }

  findByEmail(email: string): Observable<FreelancerResponseDto> {
    this.logger.log(`Finding freelancer by email: ${email}`);
    return this.backendService.get<FreelancerResponseDto>(`/freelancers/by-email/${email}`);
  }

  update(id: number, updateFreelancerDto: UpdateFreelancerDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Updating freelancer with id: ${id}`);
    return this.backendService.put<FreelancerResponseDto>(`/freelancers/${id}`, updateFreelancerDto);
  }

  changePassword(id: number, changePasswordDto: ChangePasswordDto): Observable<{ message: string }> {
    this.logger.log(`Changing password for freelancer with id: ${id}`);
    return this.backendService.put<{ message: string }>(`/freelancers/${id}/change-password`, changePasswordDto);
  }

  activateDeactivate(id: number, isActive: boolean): Observable<FreelancerResponseDto> {
    this.logger.log(`${isActive ? 'Activating' : 'Deactivating'} freelancer with id: ${id}`);
    return this.backendService.patch<FreelancerResponseDto>(`/freelancers/${id}/status`, { isActive });
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing freelancer with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/freelancers/${id}`);
  }

  updateRoles(id: number, roles: string[]): Observable<FreelancerResponseDto> {
    this.logger.log(`Updating roles for freelancer with id: ${id}`);
    return this.backendService.patch<FreelancerResponseDto>(`/freelancers/${id}/roles`, { roles });
  }

  register(createFreelancerDto: CreateFreelancerDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Public registration for freelancer: ${createFreelancerDto.nome}`);
    
    // Define role padrão para novos cadastros
    const registrationData = {
      ...createFreelancerDto,
      roles: [Role.FREELANCER], // Role padrão
    };
    
    return this.backendService.post<FreelancerResponseDto>('/freelancers/register', registrationData);
  }
}

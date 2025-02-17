import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createRoleDto: CreateRoleDto): Observable<RoleResponseDto> {
    this.logger.log(`Creating new role: ${createRoleDto.name}`);
    return this.backendService.post<RoleResponseDto>('/roles', createRoleDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<RoleResponseDto>> {
    this.logger.log(`Fetching roles with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<RoleResponseDto>>(`/roles?${queryParams}`);
  }

  findAllActive(): Observable<RoleResponseDto[]> {
    this.logger.log('Fetching all active roles');
    return this.backendService.get<RoleResponseDto[]>('/roles/active');
  }

  findOne(id: number): Observable<RoleResponseDto> {
    this.logger.log(`Fetching role with id: ${id}`);
    return this.backendService.get<RoleResponseDto>(`/roles/${id}`);
  }

  findByName(name: string): Observable<RoleResponseDto> {
    this.logger.log(`Finding role by name: ${name}`);
    return this.backendService.get<RoleResponseDto>(`/roles/by-name/${name}`);
  }

  update(id: number, updateRoleDto: UpdateRoleDto): Observable<RoleResponseDto> {
    this.logger.log(`Updating role with id: ${id}`);
    return this.backendService.put<RoleResponseDto>(`/roles/${id}`, updateRoleDto);
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing role with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/roles/${id}`);
  }

  toggleStatus(id: number, isActive: boolean): Observable<RoleResponseDto> {
    this.logger.log(`${isActive ? 'Activating' : 'Deactivating'} role with id: ${id}`);
    return this.backendService.patch<RoleResponseDto>(`/roles/${id}/status`, { isActive });
  }

  assignRolesToFreelancer(assignRoleDto: AssignRoleDto): Observable<{ message: string }> {
    this.logger.log(`Assigning roles to freelancer: ${assignRoleDto.freelancerId}`);
    return this.backendService.post<{ message: string }>('/roles/assign', assignRoleDto);
  }

  removeRoleFromFreelancer(freelancerId: number, roleId: number): Observable<{ message: string }> {
    this.logger.log(`Removing role ${roleId} from freelancer ${freelancerId}`);
    return this.backendService.delete<{ message: string }>(`/roles/freelancer/${freelancerId}/role/${roleId}`);
  }

  getFreelancerRoles(freelancerId: number): Observable<RoleResponseDto[]> {
    this.logger.log(`Getting roles for freelancer: ${freelancerId}`);
    return this.backendService.get<RoleResponseDto[]>(`/roles/freelancer/${freelancerId}`);
  }
}

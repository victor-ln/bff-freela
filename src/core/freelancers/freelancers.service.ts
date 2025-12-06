import { Injectable, Logger } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { FreelancerResponseDto } from './dto/freelancer-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateFreelancerRolesDto } from './dto/update-freelancer-roles.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Role } from 'src/auth/roles/roles.enum';

@Injectable()
export class FreelancersService {
  private readonly logger = new Logger(FreelancersService.name);

  constructor(private readonly backendService: BackendService) {}

  /**
   * Cria um novo freelancer (Admin)
   */
  create(createFreelancerDto: CreateFreelancerDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Creating new freelancer: ${createFreelancerDto.nome}`);
    return this.backendService.post<any>('/freelancer', createFreelancerDto).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Lista todos os freelancers com paginação
   * 
   * Query params disponíveis:
   * - page: número da página
   * - limit: itens por página
   * - search: busca por nome
   */
  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<FreelancerResponseDto>> {
    this.logger.log(`Fetching freelancers with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<any>(`/freelancer?${queryParams}`).pipe(
      map(response => this.extractPaginatedResponse(response, pagination))
    );
  }

  /**
   * Busca freelancer por ID
   */
  findOne(id: number): Observable<FreelancerResponseDto> {
    this.logger.log(`Fetching freelancer with id: ${id}`);
    return this.backendService.get<any>(`/freelancer/${id}`).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Busca freelancer por ID (alias para findOne)
   * Mantido para compatibilidade com JWT Strategy
   */
  findById(id: number): Observable<FreelancerResponseDto> {
    this.logger.log(`Finding freelancer by id: ${id}`);
    return this.findOne(id);
  }

  /**
   * Busca freelancer por username (email)
   * 
   * IMPORTANTE: No nosso sistema, username É o email.
   * Esta rota é usada pelo AuthService durante o login.
   */
  findByUsername(username: string): Observable<FreelancerResponseDto> {
    this.logger.log(`Finding freelancer by username (email): ${username}`);
    return this.backendService.get<any>(`/freelancer/by-email/${username}`).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Busca freelancer por email
   */
  findByEmail(email: string): Observable<FreelancerResponseDto> {
    this.logger.log(`Finding freelancer by email: ${email}`);
    return this.backendService.get<any>(`/freelancer/by-email/${email}`).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Atualiza dados do freelancer
   */
  update(id: number, updateFreelancerDto: UpdateFreelancerDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Updating freelancer with id: ${id}`);
    return this.backendService.patch<any>(`/freelancer/${id}`, updateFreelancerDto).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Altera senha do freelancer
   * 
   * IMPORTANTE: O frontend deve enviar a senha já criptografada no campo 'novaSenhaHash'
   */
  changePassword(id: number, changePasswordDto: ChangePasswordDto): Observable<{ message: string }> {
    this.logger.log(`Changing password for freelancer with id: ${id}`);
    return this.backendService.patch<any>(`/freelancer/${id}/change-password`, changePasswordDto).pipe(
      map(response => ({ message: response.message || 'Senha alterada com sucesso' }))
    );
  }

  /**
   * Ativa ou desativa um freelancer
   * 
   * Usa o endpoint genérico PATCH /freelancer/:id com { ativo: boolean }
   * Não há endpoint /status dedicado
   */
  activateDeactivate(id: number, ativo: boolean): Observable<FreelancerResponseDto> {
    this.logger.log(`${ativo ? 'Activating' : 'Deactivating'} freelancer with id: ${id}`);
    return this.backendService.patch<any>(`/freelancer/${id}`, { ativo }).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Remove um freelancer
   */
  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing freelancer with id: ${id}`);
    return this.backendService.delete<any>(`/freelancer/${id}`).pipe(
      map(response => ({ message: response.message || 'Freelancer removido com sucesso' }))
    );
  }

  /**
   * Atualiza as roles de um freelancer
   * 
   * IMPORTANTE: Enviar 'roleNames' (array de strings), não 'roles'
   */
  updateRoles(id: number, updateRolesDto: UpdateFreelancerRolesDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Updating roles for freelancer with id: ${id}`);
    return this.backendService.patch<any>(`/freelancer/${id}/roles`, updateRolesDto).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Registro público de novo freelancer
   * 
   * Define automaticamente a role padrão 'Freelancer'
   */
  register(createFreelancerDto: CreateFreelancerDto): Observable<FreelancerResponseDto> {
    this.logger.log(`Public registration for freelancer: ${createFreelancerDto.nome}`);
    
    const registrationData = {
      ...createFreelancerDto,
      roles: ['Freelancer'], // Role padrão para novos cadastros
    };
    
    return this.backendService.post<any>('/freelancer/register', registrationData).pipe(
      map(response => this.extractDataFromResponse(response))
    );
  }

  /**
   * Helper para extrair dados do formato de resposta do backend
   * 
   * O backend retorna:
   * {
   *   "timestamp": "2024-01-15T10:00:00",
   *   "status": 200,
   *   "message": "sucesso",
   *   "dados": { ...FreelancerReponseDto }
   * }
   */
  private extractDataFromResponse(response: any): FreelancerResponseDto {
    return response.dados || response;
  }

  /**
   * Helper para extrair resposta paginada do backend
   * 
   * O backend retorna:
   * {
   *   "dados": {
   *     "data": [...],
   *     "total": 100,
   *     "page": 1,
   *     "limit": 10,
   *     "totalPages": 10
   *   }
   * }
   */
  private extractPaginatedResponse(
    response: any,
    pagination: PaginationDto
  ): PaginatedResponseDto<FreelancerResponseDto> {
    const dados = response.dados || {};
    
    return {
      data: dados.data || [],
      total: dados.total || 0,
      page: dados.page || pagination.page,
      limit: dados.limit || pagination.limit,
      totalPages: dados.totalPages || Math.ceil((dados.total || 0) / (dados.limit || pagination.limit)),
    };
  }
}
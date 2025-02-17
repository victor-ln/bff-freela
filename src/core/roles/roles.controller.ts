import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova role' })
  @ApiResponse({ 
    status: 201, 
    description: 'Role criada com sucesso',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Role já existe' 
  })
  create(@Body() createRoleDto: CreateRoleDto): Observable<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todas as roles com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Freelancer' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles recuperada com sucesso',
    type: PaginatedResponseDto<RoleResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<RoleResponseDto>> {
    return this.rolesService.findAll(pagination);
  }

  @Get('active')
  @Roles(Role.ADMIN, Role.FREELANCER, Role.FREELANCER_PREMIUM)
  @ApiOperation({ summary: 'Listar todas as roles ativas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles ativas',
    type: [RoleResponseDto]
  })
  findAllActive(): Observable<RoleResponseDto[]> {
    return this.rolesService.findAllActive();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar role por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Role encontrada',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Role não encontrada' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<RoleResponseDto> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar role' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Role atualizada com sucesso',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Role não encontrada' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ): Observable<RoleResponseDto> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Ativar/Desativar role' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status da role alterado com sucesso',
    type: RoleResponseDto 
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean }
  ): Observable<RoleResponseDto> {
    return this.rolesService.toggleStatus(id, body.isActive);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover role' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Role removida com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Role não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Role não pode ser removida (está sendo usada por freelancers)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.rolesService.remove(id);
  }

  @Post('assign')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atribuir roles a um freelancer' })
  @ApiResponse({ 
    status: 200, 
    description: 'Roles atribuídas com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer ou role não encontrados' 
  })
  assignRoles(@Body() assignRoleDto: AssignRoleDto): Observable<{ message: string }> {
    return this.rolesService.assignRolesToFreelancer(assignRoleDto);
  }

  @Delete('freelancer/:freelancerId/role/:roleId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover role de um freelancer' })
  @ApiParam({ name: 'freelancerId', type: Number, example: 1 })
  @ApiParam({ name: 'roleId', type: Number, example: 2 })
  @ApiResponse({ 
    status: 204, 
    description: 'Role removida do freelancer com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer ou role não encontrados' 
  })
  removeRoleFromFreelancer(
    @Param('freelancerId', ParseIntPipe) freelancerId: number,
    @Param('roleId', ParseIntPipe) roleId: number
  ): Observable<{ message: string }> {
    return this.rolesService.removeRoleFromFreelancer(freelancerId, roleId);
  }

  @Get('freelancer/:freelancerId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obter roles de um freelancer' })
  @ApiParam({ name: 'freelancerId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Roles do freelancer',
    type: [RoleResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer não encontrado' 
  })
  getFreelancerRoles(@Param('freelancerId', ParseIntPipe) freelancerId: number): Observable<RoleResponseDto[]> {
    return this.rolesService.getFreelancerRoles(freelancerId);
  }

  @Get('by-name/:name')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Buscar role por nome' })
  @ApiParam({ name: 'name', type: String, example: 'Freelancer Premium' })
  @ApiResponse({ 
    status: 200, 
    description: 'Role encontrada',
    type: RoleResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Role não encontrada' 
  })
  findByName(@Param('name') name: string): Observable<RoleResponseDto> {
    return this.rolesService.findByName(name);
  }
}

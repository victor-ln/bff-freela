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
import { FreelancersService } from './freelancers.service';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { FreelancerResponseDto } from './dto/freelancer-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationDto, PaginatedResponseDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import type { AuthenticatedUser } from 'src/auth/strategies/jwt.strategy';

@ApiTags('freelancers')
@Controller('freelancers')
export class FreelancersController {
  constructor(private readonly freelancersService: FreelancersService) {}

  @Post('register')
  @Public()
  @ApiOperation({ 
    summary: 'Cadastro público de freelancer',
    description: 'Permite que qualquer pessoa se cadastre como freelancer na plataforma'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Freelancer cadastrado com sucesso',
    type: FreelancerResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email ou CPF/CNPJ já existe' 
  })
  register(@Body() createFreelancerDto: CreateFreelancerDto): Observable<FreelancerResponseDto> {
    return this.freelancersService.register(createFreelancerDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Criar freelancer (Admin apenas)',
    description: 'Permite que administradores criem contas de freelancer'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Freelancer criado pelo admin com sucesso',
    type: FreelancerResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Freelancer já existe (email ou CPF/CNPJ duplicado)' 
  })
  create(@Body() createFreelancerDto: CreateFreelancerDto): Observable<FreelancerResponseDto> {
    return this.freelancersService.create(createFreelancerDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os freelancers com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'João' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de freelancers recuperada com sucesso',
    type: PaginatedResponseDto<FreelancerResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<FreelancerResponseDto>> {
    return this.freelancersService.findAll(pagination);
  }

  @Get('profile')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do freelancer logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil do freelancer',
    type: FreelancerResponseDto 
  })
  getProfile(@CurrentUser() user: AuthenticatedUser): Observable<FreelancerResponseDto> {
    return this.freelancersService.findById(user.userId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar freelancer por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Freelancer encontrado',
    type: FreelancerResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer não encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<FreelancerResponseDto> {
    return this.freelancersService.findOne(id);
  }

  @Patch('profile')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil do freelancer logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil atualizado com sucesso',
    type: FreelancerResponseDto 
  })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateFreelancerDto: UpdateFreelancerDto
  ): Observable<FreelancerResponseDto> {
    return this.freelancersService.update(user.userId, updateFreelancerDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar freelancer (Admin apenas)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Freelancer atualizado com sucesso',
    type: FreelancerResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer não encontrado' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateFreelancerDto: UpdateFreelancerDto
  ): Observable<FreelancerResponseDto> {
    return this.freelancersService.update(id, updateFreelancerDto);
  }

  @Patch('change-password')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alterar senha do freelancer logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Senha alterada com sucesso' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Senha atual incorreta' 
  })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() changePasswordDto: ChangePasswordDto
  ): Observable<{ message: string }> {
    return this.freelancersService.changePassword(user.userId, changePasswordDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ativar/Desativar freelancer' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status do freelancer alterado com sucesso',
    type: FreelancerResponseDto 
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean }
  ): Observable<FreelancerResponseDto> {
    return this.freelancersService.activateDeactivate(id, body.isActive);
  }

  @Patch(':id/roles')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar roles do freelancer' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Roles atualizadas com sucesso',
    type: FreelancerResponseDto 
  })
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roles: string[] }
  ): Observable<FreelancerResponseDto> {
    return this.freelancersService.updateRoles(id, body.roles);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover freelancer' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Freelancer removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Freelancer não pode ser removido (possui propostas ou contratos ativos)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.freelancersService.remove(id);
  }

  @Get('by-username/:username')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar freelancer por username' })
  @ApiParam({ name: 'username', type: String, example: 'joaosilva' })
  @ApiResponse({ 
    status: 200, 
    description: 'Freelancer encontrado',
    type: FreelancerResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer não encontrado' 
  })
  findByUsername(@Param('username') username: string): Observable<FreelancerResponseDto> {
    return this.freelancersService.findByUsername(username);
  }

  @Get('by-email/:email')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar freelancer por email' })
  @ApiParam({ name: 'email', type: String, example: 'joao@email.com' })
  @ApiResponse({ 
    status: 200, 
    description: 'Freelancer encontrado',
    type: FreelancerResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Freelancer não encontrado' 
  })
  findByEmail(@Param('email') email: string): Observable<FreelancerResponseDto> {
    return this.freelancersService.findByEmail(email);
  }
}

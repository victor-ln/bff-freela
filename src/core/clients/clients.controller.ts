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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ 
    status: 201, 
    description: 'Cliente criado com sucesso',
    type: ClientResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Cliente já existe (email ou CPF/CNPJ duplicado)' 
  })
  create(@Body() createClientDto: CreateClientDto): Observable<ClientResponseDto> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os clientes com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'João' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de clientes recuperada com sucesso',
    type: PaginatedResponseDto<ClientResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<ClientResponseDto>> {
    return this.clientsService.findAll(pagination);
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente encontrado',
    type: ClientResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ClientResponseDto> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente atualizado com sucesso',
    type: ClientResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateClientDto: UpdateClientDto
  ): Observable<ClientResponseDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover cliente' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Cliente removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Cliente não pode ser removido (possui propostas ativas)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.clientsService.remove(id);
  }

  @Get('by-email/:email')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar cliente por email' })
  @ApiParam({ name: 'email', type: String, example: 'cliente@email.com' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente encontrado',
    type: ClientResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  findByEmail(@Param('email') email: string): Observable<ClientResponseDto> {
    return this.clientsService.findByEmail(email);
  }

  @Get('by-document/:cpfCnpj')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar cliente por CPF/CNPJ' })
  @ApiParam({ name: 'cpfCnpj', type: String, example: '123.456.789-00' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cliente encontrado',
    type: ClientResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  findByCpfCnpj(@Param('cpfCnpj') cpfCnpj: string): Observable<ClientResponseDto> {
    return this.clientsService.findByCpfCnpj(cpfCnpj);
  }
}

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
  HttpStatus,
  ParseFloatPipe
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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';
import { ServiceStatus } from './enums/service-status.enum';

@ApiTags('services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar um novo serviço' })
  @ApiResponse({ 
    status: 201, 
    description: 'Serviço criado com sucesso',
    type: ServiceResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria ou template não encontrado' 
  })
  create(@Body() createServiceDto: CreateServiceDto): Observable<ServiceResponseDto> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os serviços com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Website' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de serviços recuperada com sucesso',
    type: PaginatedResponseDto<ServiceResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<ServiceResponseDto>> {
    return this.servicesService.findAll(pagination);
  }

  @Get('active')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar serviços ativos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de serviços ativos',
    type: [ServiceResponseDto]
  })
  findActive(): Observable<ServiceResponseDto[]> {
    return this.servicesService.findActive();
  }

  @Get('by-status/:status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar serviços por status' })
  @ApiParam({ name: 'status', enum: ServiceStatus, example: ServiceStatus.ATIVO })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de serviços filtrados por status',
    type: [ServiceResponseDto]
  })
  findByStatus(@Param('status') status: ServiceStatus): Observable<ServiceResponseDto[]> {
    return this.servicesService.findByStatus(status);
  }

  @Get('category/:categoriaId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar serviços por categoria' })
  @ApiParam({ name: 'categoriaId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de serviços da categoria',
    type: [ServiceResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria não encontrada' 
  })
  findByCategory(@Param('categoriaId', ParseIntPipe) categoriaId: number): Observable<ServiceResponseDto[]> {
    return this.servicesService.findByCategory(categoriaId);
  }

  @Get('price-range')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar serviços por faixa de preço' })
  @ApiQuery({ name: 'minPrice', type: Number, example: 500 })
  @ApiQuery({ name: 'maxPrice', type: Number, example: 2000 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de serviços na faixa de preço',
    type: [ServiceResponseDto]
  })
  findByPriceRange(
    @Query('minPrice', ParseFloatPipe) minPrice: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice: number
  ): Observable<ServiceResponseDto[]> {
    return this.servicesService.findByPriceRange(minPrice, maxPrice);
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Serviço encontrado',
    type: ServiceResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Serviço não encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ServiceResponseDto> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar serviço' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Serviço atualizado com sucesso',
    type: ServiceResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Serviço não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Serviço não pode ser editado (está sendo usado em propostas ativas)' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateServiceDto: UpdateServiceDto
  ): Observable<ServiceResponseDto> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Patch(':id/status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Alterar status do serviço' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status do serviço alterado com sucesso',
    type: ServiceResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Serviço não encontrado' 
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: ServiceStatus }
  ): Observable<ServiceResponseDto> {
    return this.servicesService.toggleStatus(id, body.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover serviço' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Serviço removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Serviço não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Serviço não pode ser removido (está sendo usado em propostas ativas)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.servicesService.remove(id);
  }
}

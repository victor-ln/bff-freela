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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({ 
    status: 201, 
    description: 'Categoria criada com sucesso',
    type: CategoryResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Categoria já existe' 
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Observable<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todas as categorias com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Design' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorias recuperada com sucesso',
    type: PaginatedResponseDto<CategoryResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<CategoryResponseDto>> {
    return this.categoriesService.findAll(pagination);
  }

  @Get('active')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todas as categorias ativas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorias ativas',
    type: [CategoryResponseDto]
  })
  findAllActive(): Observable<CategoryResponseDto[]> {
    return this.categoriesService.findAllActive();
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria encontrada',
    type: CategoryResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria não encontrada' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria atualizada com sucesso',
    type: CategoryResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria não encontrada' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Observable<CategoryResponseDto> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Ativar/Desativar categoria' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status da categoria alterado com sucesso',
    type: CategoryResponseDto 
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: boolean }
  ): Observable<CategoryResponseDto> {
    return this.categoriesService.toggleStatus(id, body.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover categoria' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Categoria removida com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Categoria não pode ser removida (está sendo usada por serviços)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.categoriesService.remove(id);
  }

  @Get('by-tipo/:tipo')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar categoria por tipo' })
  @ApiParam({ name: 'tipo', type: String, example: 'Design Gráfico' })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoria encontrada',
    type: CategoryResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoria não encontrada' 
  })
  findByTipo(@Param('tipo') tipo: string): Observable<CategoryResponseDto> {
    return this.categoriesService.findByTipo(tipo);
  }
}

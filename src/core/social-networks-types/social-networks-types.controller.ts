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
import { SocialNetworksTypesService } from './social-networks-types.service';
import { CreateSocialNetworksTypeDto } from './dto/create-social-networks-type.dto';
import { UpdateSocialNetworksTypeDto } from './dto/update-social-networks-type.dto';
import { SocialNetworksTypeResponseDto } from './dto/social-networks-type-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';

@ApiTags('social-networks-types')
@ApiBearerAuth()
@Controller('social-networks-types')
export class SocialNetworksTypesController {
  constructor(private readonly socialNetworksTypesService: SocialNetworksTypesService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar um novo tipo de rede social' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tipo de rede social criado com sucesso',
    type: SocialNetworksTypeResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Tipo de rede social já existe' 
  })
  create(@Body() createSocialNetworksTypeDto: CreateSocialNetworksTypeDto): Observable<SocialNetworksTypeResponseDto> {
    return this.socialNetworksTypesService.create(createSocialNetworksTypeDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os tipos de redes sociais com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Instagram' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tipos de redes sociais recuperada com sucesso',
    type: PaginatedResponseDto<SocialNetworksTypeResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<SocialNetworksTypeResponseDto>> {
    return this.socialNetworksTypesService.findAll(pagination);
  }

  @Get('active')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os tipos de redes sociais ativas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tipos de redes sociais ativas',
    type: [SocialNetworksTypeResponseDto]
  })
  findAllActive(): Observable<SocialNetworksTypeResponseDto[]> {
    return this.socialNetworksTypesService.findAllActive();
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar tipo de rede social por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tipo de rede social encontrado',
    type: SocialNetworksTypeResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de rede social não encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<SocialNetworksTypeResponseDto> {
    return this.socialNetworksTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar tipo de rede social' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tipo de rede social atualizado com sucesso',
    type: SocialNetworksTypeResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de rede social não encontrado' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSocialNetworksTypeDto: UpdateSocialNetworksTypeDto
  ): Observable<SocialNetworksTypeResponseDto> {
    return this.socialNetworksTypesService.update(id, updateSocialNetworksTypeDto);
  }

  @Patch(':id/status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Ativar/Desativar tipo de rede social' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status do tipo de rede social alterado com sucesso',
    type: SocialNetworksTypeResponseDto 
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: boolean }
  ): Observable<SocialNetworksTypeResponseDto> {
    return this.socialNetworksTypesService.toggleStatus(id, body.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover tipo de rede social' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Tipo de rede social removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de rede social não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Tipo de rede social não pode ser removido (está sendo usado)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.socialNetworksTypesService.remove(id);
  }

  @Get('by-tipo/:tipo')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar tipo de rede social por tipo' })
  @ApiParam({ name: 'tipo', type: String, example: 'Instagram' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tipo de rede social encontrado',
    type: SocialNetworksTypeResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de rede social não encontrado' 
  })
  findByTipo(@Param('tipo') tipo: string): Observable<SocialNetworksTypeResponseDto> {
    return this.socialNetworksTypesService.findByTipo(tipo);
  }
}

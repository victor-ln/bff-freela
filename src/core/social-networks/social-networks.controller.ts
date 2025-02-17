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
import { SocialNetworksService } from './social-networks.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';
import { SocialNetworkResponseDto } from './dto/social-network-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';

@ApiTags('social-networks')
@ApiBearerAuth()
@Controller('social-networks')
export class SocialNetworksController {
  constructor(private readonly socialNetworksService: SocialNetworksService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova rede social para cliente' })
  @ApiResponse({ 
    status: 201, 
    description: 'Rede social criada com sucesso',
    type: SocialNetworkResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente ou tipo de rede social não encontrado' 
  })
  create(@Body() createSocialNetworkDto: CreateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    return this.socialNetworksService.create(createSocialNetworkDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todas as redes sociais com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: '@joao' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de redes sociais recuperada com sucesso',
    type: PaginatedResponseDto<SocialNetworkResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<SocialNetworkResponseDto>> {
    return this.socialNetworksService.findAll(pagination);
  }

  @Get('client/:clienteId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar redes sociais de um cliente específico' })
  @ApiParam({ name: 'clienteId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de redes sociais do cliente',
    type: [SocialNetworkResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  findByClient(@Param('clienteId', ParseIntPipe) clienteId: number): Observable<SocialNetworkResponseDto[]> {
    return this.socialNetworksService.findByClient(clienteId);
  }

  @Get('type/:tipoId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar redes sociais por tipo' })
  @ApiParam({ name: 'tipoId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de redes sociais do tipo especificado',
    type: [SocialNetworkResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tipo de rede social não encontrado' 
  })
  findByType(@Param('tipoId', ParseIntPipe) tipoId: number): Observable<SocialNetworkResponseDto[]> {
    return this.socialNetworksService.findByType(tipoId);
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar rede social por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Rede social encontrada',
    type: SocialNetworkResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rede social não encontrada' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<SocialNetworkResponseDto> {
    return this.socialNetworksService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar rede social' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Rede social atualizada com sucesso',
    type: SocialNetworkResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rede social não encontrada' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSocialNetworkDto: UpdateSocialNetworkDto
  ): Observable<SocialNetworkResponseDto> {
    return this.socialNetworksService.update(id, updateSocialNetworkDto);
  }

  @Delete(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover rede social' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Rede social removida com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rede social não encontrada' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.socialNetworksService.remove(id);
  }
}

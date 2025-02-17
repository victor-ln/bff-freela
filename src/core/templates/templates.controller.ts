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
  Res
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
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateResponseDto } from './dto/template-response.dto';
import { ApproveTemplateDto } from './dto/approve-template.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';
import { TemplateStatus } from './enums/template-status.enum';

@ApiTags('templates')
@ApiBearerAuth()
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar um novo template' })
  @ApiResponse({ 
    status: 201, 
    description: 'Template criado com sucesso',
    type: TemplateResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  create(@Body() createTemplateDto: CreateTemplateDto): Observable<TemplateResponseDto> {
    return this.templatesService.create(createTemplateDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN, Role.LEGAL_ANALYST)
  @ApiOperation({ summary: 'Listar todos os templates com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Contrato' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de templates recuperada com sucesso',
    type: PaginatedResponseDto<TemplateResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<TemplateResponseDto>> {
    return this.templatesService.findAll(pagination);
  }

  @Get('approved')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar templates aprovados' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de templates aprovados',
    type: [TemplateResponseDto]
  })
  findApproved(): Observable<TemplateResponseDto[]> {
    return this.templatesService.findApproved();
  }

  @Get('by-status/:status')
  @Roles(Role.ADMIN, Role.LEGAL_ANALYST)
  @ApiOperation({ summary: 'Listar templates por status' })
  @ApiParam({ name: 'status', enum: TemplateStatus, example: TemplateStatus.UNDER_REVIEW })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de templates filtrados por status',
    type: [TemplateResponseDto]
  })
  findByStatus(@Param('status') status: TemplateStatus): Observable<TemplateResponseDto[]> {
    return this.templatesService.findByStatus(status);
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN, Role.LEGAL_ANALYST)
  @ApiOperation({ summary: 'Buscar template por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Template encontrado',
    type: TemplateResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Template não encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<TemplateResponseDto> {
    return this.templatesService.findOne(id);
  }

  @Get(':id/download')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Download do template' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Download iniciado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Template não encontrado' 
  })
  downloadTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ): Observable<Blob> {
    return this.templatesService.downloadTemplate(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar template (apenas se em revisão)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Template atualizado com sucesso',
    type: TemplateResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Template não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Template já aprovado, não pode ser editado' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTemplateDto: UpdateTemplateDto
  ): Observable<TemplateResponseDto> {
    return this.templatesService.update(id, updateTemplateDto);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.LEGAL_ANALYST)
  @ApiOperation({ summary: 'Aprovar/Rejeitar template' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status do template alterado com sucesso',
    type: TemplateResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Template não encontrado' 
  })
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveTemplateDto: ApproveTemplateDto
  ): Observable<TemplateResponseDto> {
    return this.templatesService.approve(id, approveTemplateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover template' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Template removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Template não encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Template não pode ser removido (está sendo usado em propostas)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.templatesService.remove(id);
  }
}

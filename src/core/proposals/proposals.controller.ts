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
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalResponseDto } from './dto/proposal-response.dto';
import { AcceptProposalDto } from './dto/accept-proposal.dto';
import { GenerateContractDto } from './dto/generate-contract.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';
import { ProposalStatus } from './enums/proposal-status.enum';

@ApiTags('proposals')
@ApiBearerAuth()
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova proposta' })
  @ApiResponse({ 
    status: 201, 
    description: 'Proposta criada com sucesso',
    type: ProposalResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente, serviço ou template não encontrado' 
  })
  create(@Body() createProposalDto: CreateProposalDto): Observable<ProposalResponseDto> {
    return this.proposalsService.create(createProposalDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todas as propostas com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Website' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propostas recuperada com sucesso',
    type: PaginatedResponseDto<ProposalResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<ProposalResponseDto>> {
    return this.proposalsService.findAll(pagination);
  }

  @Get('accepted')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar propostas aceitas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propostas aceitas',
    type: [ProposalResponseDto]
  })
  findAccepted(): Observable<ProposalResponseDto[]> {
    return this.proposalsService.findAccepted();
  }

  @Get('drafts')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar propostas em rascunho' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propostas em rascunho',
    type: [ProposalResponseDto]
  })
  findDrafts(): Observable<ProposalResponseDto[]> {
    return this.proposalsService.findDrafts();
  }

  @Get('metrics')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Obter métricas das propostas' })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas das propostas' 
  })
  getMetrics(): Observable<any> {
    return this.proposalsService.getProposalMetrics();
  }

  @Get('by-status/:status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar propostas por status' })
  @ApiParam({ name: 'status', enum: ProposalStatus, example: ProposalStatus.ACCEPTED })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propostas filtradas por status',
    type: [ProposalResponseDto]
  })
  findByStatus(@Param('status') status: ProposalStatus): Observable<ProposalResponseDto[]> {
    return this.proposalsService.findByStatus(status);
  }

  @Get('client/:clienteId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar propostas de um cliente específico' })
  @ApiParam({ name: 'clienteId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de propostas do cliente',
    type: [ProposalResponseDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cliente não encontrado' 
  })
  findByClient(@Param('clienteId', ParseIntPipe) clienteId: number): Observable<ProposalResponseDto[]> {
    return this.proposalsService.findByClient(clienteId);
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar proposta por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Proposta encontrada',
    type: ProposalResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ProposalResponseDto> {
    return this.proposalsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar proposta (apenas se não aceita)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Proposta atualizada com sucesso',
    type: ProposalResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Proposta já aceita, não pode ser editada' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProposalDto: UpdateProposalDto
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.update(id, updateProposalDto);
  }

  @Patch(':id/accept')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Aceitar proposta com evidência' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Proposta aceita com sucesso',
    type: ProposalResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Evidência inválida' 
  })
  acceptProposal(
    @Param('id', ParseIntPipe) id: number,
    @Body() acceptProposalDto: AcceptProposalDto
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.acceptProposal(id, acceptProposalDto);
  }

  @Patch(':id/reject')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Rejeitar proposta' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Proposta rejeitada com sucesso',
    type: ProposalResponseDto 
  })
  rejectProposal(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason?: string }
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.rejectProposal(id, body.reason);
  }

  @Post(':id/generate-contract')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Gerar contrato a partir da proposta aceita' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 201, 
    description: 'Contrato gerado com sucesso',
    type: ProposalResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Proposta ainda não foi aceita' 
  })
  generateContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() generateContractDto: GenerateContractDto
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.generateContract(id, generateContractDto);
  }

  @Get(':id/contract/download')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Download do contrato da proposta' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiQuery({ name: 'format', enum: ['pdf', 'docx'], required: false, example: 'docx' })
  @ApiResponse({ 
    status: 200, 
    description: 'Download do contrato iniciado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta ou contrato não encontrado' 
  })
  downloadContract(
    @Param('id', ParseIntPipe) id: number,
    @Query('format') format: 'pdf' | 'docx' = 'docx'
  ): Observable<Blob> {
    return this.proposalsService.downloadContract(id, format);
  }

  @Post(':id/upload-edited-contract')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Upload de contrato editado manualmente' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Contrato editado enviado com sucesso',
    type: ProposalResponseDto 
  })
  uploadEditedContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { contractFile: string }
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.uploadEditedContract(id, body.contractFile);
  }

  @Post(':id/send-email')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Enviar contrato por email' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Email enviado com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Email inválido' 
  })
  sendContractEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() sendEmailDto: SendEmailDto
  ): Observable<{ message: string }> {
    return this.proposalsService.sendContractEmail(id, sendEmailDto);
  }

  @Post(':id/attach-signed-contract')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Anexar contrato assinado' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Contrato assinado anexado com sucesso',
    type: ProposalResponseDto 
  })
  attachSignedContract(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { signedContractFile: string }
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.attachSignedContract(id, body.signedContractFile);
  }

  @Patch(':id/status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Alterar status da proposta' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Status alterado com sucesso',
    type: ProposalResponseDto 
  })
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: ProposalStatus }
  ): Observable<ProposalResponseDto> {
    return this.proposalsService.toggleStatus(id, body.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover proposta' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Proposta removida com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Proposta não pode ser removida (já aceita ou com contrato)' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.proposalsService.remove(id);
  }
}

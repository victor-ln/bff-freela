import { ApiProperty } from '@nestjs/swagger';
import { ClientResponseDto } from '../../clients/dto/client-response.dto';
import { ServiceResponseDto } from '../../services/dto/service-response.dto';
import { TemplateResponseDto } from '../../templates/dto/template-response.dto';
import { ProposalStatus } from '../enums/proposal-status.enum';
import { ContractStatus } from '../enums/contract-status.enum';

export class ProposalResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty({
    description: 'Cliente associado à proposta',
    type: ClientResponseDto,
  })
  cliente: ClientResponseDto;

  @ApiProperty({
    description: 'Serviços incluídos na proposta',
    type: [ServiceResponseDto],
  })
  servicos: ServiceResponseDto[];

  @ApiProperty({
    description: 'Template utilizado',
    type: TemplateResponseDto,
  })
  template: TemplateResponseDto;

  @ApiProperty()
  valorTotal: number;

  @ApiProperty({ enum: ProposalStatus })
  status: ProposalStatus;

  @ApiProperty({ enum: ContractStatus })
  contratoStatus: ContractStatus;

  @ApiProperty()
  observacoes?: string;

  @ApiProperty()
  evidenciaAceite?: string;

  @ApiProperty()
  contratoGerado?: string;

  @ApiProperty()
  contratoEditado?: string;

  @ApiProperty()
  dataEdicaoContrato?: Date;

  @ApiProperty()
  emailEnviado?: boolean;

  @ApiProperty()
  dataEnvioEmail?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

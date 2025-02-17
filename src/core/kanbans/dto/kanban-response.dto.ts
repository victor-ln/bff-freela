import { ApiProperty } from '@nestjs/swagger';
import { ProposalResponseDto } from '../../proposals/dto/proposal-response.dto';

export class KanbanResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao?: string;

  @ApiProperty({
    description: 'Proposta associada ao Kanban',
    type: () => ProposalResponseDto,
  })
  proposta: ProposalResponseDto;

  @ApiProperty({
    description: 'Colunas do Kanban',
    type: [String],
  })
  colunas: string[];

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

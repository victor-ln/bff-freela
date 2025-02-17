import { IsString, IsNotEmpty, IsNumber, IsOptional, Length, IsArray, ArrayNotEmpty, IsEnum, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProposalStatus } from '../enums/proposal-status.enum';

export class CreateProposalDto {
  @ApiProperty({
    description: 'Título da proposta',
    example: 'Desenvolvimento de Website Corporativo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada da proposta',
    example: 'Desenvolvimento completo de website corporativo responsivo com 8 páginas e sistema de contato',
  })
  @IsString()
  @IsNotEmpty()
  @Length(20, 2000)
  descricao: string;

  @ApiProperty({
    description: 'ID do cliente associado',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  clienteId: number;

  @ApiProperty({
    description: 'IDs dos serviços incluídos na proposta',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  servicosIds: number[];

  @ApiProperty({
    description: 'ID do template a ser usado',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  templateId: number;

  @ApiProperty({
    description: 'Valor total da proposta',
    example: 5000.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valorTotal: number;

  @ApiProperty({
    description: 'Status inicial da proposta',
    enum: ProposalStatus,
    example: ProposalStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProposalStatus)
  status?: ProposalStatus;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Prazo de entrega: 30 dias úteis',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  observacoes?: string;
}

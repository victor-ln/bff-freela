import { IsString, IsNotEmpty, IsNumber, IsOptional, Length, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKanbanDto {
  @ApiProperty({
    description: 'Título do quadro Kanban',
    example: 'Desenvolvimento Website Corporativo - João Silva',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  titulo: string;

  @ApiProperty({
    description: 'Descrição do quadro Kanban',
    example: 'Quadro para gerenciar as tarefas do projeto de desenvolvimento do website',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  descricao?: string;

  @ApiProperty({
    description: 'ID da proposta associada ao Kanban',
    example: 1,
  })
  @IsNumber()
  propostaId: number;

  @ApiProperty({
    description: 'Colunas personalizadas do Kanban',
    example: ['A Fazer', 'Em Progresso', 'Em Revisão', 'Concluído'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  colunas?: string[];
}
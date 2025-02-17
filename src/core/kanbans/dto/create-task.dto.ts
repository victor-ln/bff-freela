import { IsString, IsNotEmpty, IsNumber, IsOptional, Length, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Criar página inicial responsiva',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Desenvolver página inicial com design responsivo para desktop e mobile',
  })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  descricao?: string;

  @ApiProperty({
    description: 'Status inicial da tarefa',
    enum: TaskStatus,
    example: TaskStatus.TODO,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    description: 'Prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  prioridade?: TaskPriority;

  @ApiProperty({
    description: 'Data de início da tarefa',
    example: '2024-01-15T09:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({
    description: 'Data de vencimento da tarefa',
    example: '2024-01-20T18:00:00.000Z',
  })
  @IsDateString()
  dataVencimento: string;

  @ApiProperty({
    description: 'ID do quadro Kanban ao qual a tarefa pertence',
    example: 1,
  })
  @IsNumber()
  kanbanId: number;

  @ApiProperty({
    description: 'Estimativa de horas para conclusão',
    example: 8,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  estimativaHoras?: number;

  @ApiProperty({
    description: 'Tags da tarefa',
    example: ['frontend', 'responsivo', 'homepage'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class TaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao?: string;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority })
  prioridade: TaskPriority;

  @ApiProperty()
  dataInicio?: Date;

  @ApiProperty()
  dataVencimento: Date;

  @ApiProperty()
  dataConclusao?: Date;

  @ApiProperty()
  estimativaHoras?: number;

  @ApiProperty()
  horasGastas?: number;

  @ApiProperty({
    description: 'Tags da tarefa',
    type: [String],
  })
  tags: string[];

  @ApiProperty()
  kanbanId: number;

  @ApiProperty()
  ordem: number;

  @ApiProperty()
  bloqueada: boolean;

  @ApiProperty()
  motivoBloqueio?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
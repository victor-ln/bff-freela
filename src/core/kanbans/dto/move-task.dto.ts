import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class MoveTaskDto {
  @ApiProperty({
    description: 'Novo status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus)
  novoStatus: TaskStatus;

  @ApiProperty({
    description: 'Nova posição na coluna (ordem)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  novaOrdem?: number;
}
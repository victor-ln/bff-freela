import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockTaskDto {
  @ApiProperty({
    description: 'Motivo do bloqueio da tarefa',
    example: 'Aguardando aprovação do cliente para continuar',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  motivoBloqueio: string;
}
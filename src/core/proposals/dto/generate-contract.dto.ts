import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateContractDto {
  @ApiProperty({
    description: 'Observações adicionais para o contrato',
    example: 'Incluir cláusula especial sobre prazo de entrega',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoesContrato?: string;
}
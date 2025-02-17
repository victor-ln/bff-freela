import { IsString, IsNotEmpty, IsNumber, IsOptional, Length, IsEnum, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TimeUnit } from '../enums/time-unit.enum';
import { ServiceStatus } from '../enums/service-status.enum';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Desenvolvimento de Website Responsivo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada do serviço',
    example: 'Desenvolvimento completo de website responsivo com até 5 páginas',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  descricao: string;

  @ApiProperty({
    description: 'ID da categoria do serviço',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  categoriaId: number;

  @ApiProperty({
    description: 'Prazo de entrega',
    example: 15,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  prazoEntrega: number;

  @ApiProperty({
    description: 'Unidade de tempo para entrega',
    enum: TimeUnit,
    example: TimeUnit.DAYS,
  })
  @IsEnum(TimeUnit)
  unidadeTempoEntrega: TimeUnit;

  @ApiProperty({
    description: 'ID do template base associado ao serviço',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  templateBaseId: number;

  @ApiProperty({
    description: 'Status do serviço',
    enum: ServiceStatus,
    example: ServiceStatus.ATIVO,
    required: false,
  })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @ApiProperty({
    description: 'Preço base do serviço',
    example: 1500.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precoBase: number;
}

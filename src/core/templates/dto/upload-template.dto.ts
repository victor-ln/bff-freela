import { IsString, IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UploadTemplateDto {
  @ApiProperty({ description: 'Nome do template', example: 'Contrato de Prestação de Serviços' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  nome: string;

  @ApiProperty({ description: 'Descrição do template', example: 'Template padrão para contratos', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  descricao?: string;

  @ApiProperty({ description: 'ID do freelancer', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  freelancerId: number;
}

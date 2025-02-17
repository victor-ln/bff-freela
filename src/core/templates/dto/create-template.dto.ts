import { IsString, IsNotEmpty, IsOptional, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TemplateStatus } from '../enums/template-status.enum';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Nome do template',
    example: 'Contrato de Desenvolvimento Web',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  nome: string;

  @ApiProperty({
    description: 'URL ou caminho do anexo do template',
    example: '/uploads/templates/contrato-web.docx',
  })
  @IsString()
  @IsNotEmpty()
  anexo: string;

  @ApiProperty({
    description: 'Status do template',
    enum: TemplateStatus,
    example: TemplateStatus.UNDER_REVIEW,
    required: false,
  })
  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;
}

import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TemplateStatus } from '../enums/template-status.enum';

export class ApproveTemplateDto {
  @ApiProperty({
    description: 'Novo status do template',
    enum: TemplateStatus,
    example: TemplateStatus.ACTIVE,
  })
  @IsEnum(TemplateStatus)
  status: TemplateStatus;

  @ApiProperty({
    description: 'Comentário sobre a aprovação/rejeição',
    example: 'Template aprovado sem ressalvas',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(5, 500)
  comentario?: string;
}

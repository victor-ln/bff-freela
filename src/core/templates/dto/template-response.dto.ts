import { ApiProperty } from '@nestjs/swagger';
import { TemplateStatus } from '../enums/template-status.enum';

export class TemplateResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  anexo: string;

  @ApiProperty({ enum: TemplateStatus })
  status: TemplateStatus;

  @ApiProperty()
  dataCriacao: Date;

  @ApiProperty()
  dataAtualizacao: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { TemplateResponseDto } from '../../templates/dto/template-response.dto';
import { TimeUnit } from '../enums/time-unit.enum';
import { ServiceStatus } from '../enums/service-status.enum';

export class ServiceResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty({
    description: 'Categoria do serviço',
    type: CategoryResponseDto,
  })
  categoria: CategoryResponseDto;

  @ApiProperty()
  prazoEntrega: number;

  @ApiProperty({ enum: TimeUnit })
  unidadeTempoEntrega: TimeUnit;

  @ApiProperty({
    description: 'Template base associado',
    type: TemplateResponseDto,
  })
  templateBase: TemplateResponseDto;

  @ApiProperty({ enum: ServiceStatus })
  status: ServiceStatus;

  @ApiProperty()
  precoBase: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

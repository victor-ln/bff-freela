import { IsString, IsNotEmpty, IsOptional, Length, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tipo/Nome da categoria',
    example: 'Design Gráfico',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  tipo: string;

  @ApiProperty({
    description: 'Status da categoria',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

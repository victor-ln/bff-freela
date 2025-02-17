import { IsString, IsNotEmpty, IsOptional, Length, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialNetworksTypeDto {
  @ApiProperty({
    description: 'Tipo da rede social',
    example: 'Instagram',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  tipo: string;

  @ApiProperty({
    description: 'Status do tipo de rede social',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

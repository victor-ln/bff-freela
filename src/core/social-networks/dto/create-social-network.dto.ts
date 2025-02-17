import { IsString, IsNotEmpty, IsNumber, Length, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialNetworkDto {
  @ApiProperty({
    description: 'Nome da rede social do cliente',
    example: '@joaosilva',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nome: string;

  @ApiProperty({
    description: 'URL da rede social',
    example: 'https://instagram.com/joaosilva',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'ID do tipo de rede social',
    example: 1,
  })
  @IsNumber()
  tipoId: number;

  @ApiProperty({
    description: 'ID do cliente proprietário da rede social',
    example: 1,
  })
  @IsNumber()
  clienteId: number;
}

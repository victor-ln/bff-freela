import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  ruaAvenida: string;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  complemento?: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  pais: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

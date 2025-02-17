import { ApiProperty } from '@nestjs/swagger';
import { AddressResponseDto } from '../../addresses/dto/address-response.dto';

export class ClientResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  nomeRazaoSocial: string;

  @ApiProperty()
  responsavel?: string;

  @ApiProperty()
  telefonePrincipal: string;

  @ApiProperty()
  telefoneSecundario?: string;

  @ApiProperty()
  cpfCnpj: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    description: 'Endereço do cliente',
    type: AddressResponseDto,
  })
  endereco: AddressResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
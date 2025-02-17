import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../auth/roles/roles.enum';
import { AddressResponseDto } from '../../addresses/dto/address-response.dto';

export class FreelancerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  nome: string;

  senha: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  cpfCnpj: string;

  @ApiProperty({
    description: 'Endereço do freelancer',
    type: AddressResponseDto,
  })
  endereco: AddressResponseDto;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

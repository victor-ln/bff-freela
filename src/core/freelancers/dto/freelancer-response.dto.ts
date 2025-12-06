import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../auth/roles/roles.enum';
import { AddressResponseDto } from '../../addresses/dto/address-response.dto';

export class FreelancerResponseDto {
  @ApiProperty({
    description: 'ID do freelancer (também é o userId)',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do freelancer',
    example: 'João Silva',
  })
  nome: string;

  @ApiProperty({
    description: 'Email do freelancer (usado como username no login)',
    example: 'joao@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do freelancer',
    example: '123.456.789-00',
  })
  cpfCnpj: string;

  @ApiProperty({
    description: 'Status ativo/inativo do freelancer',
    example: true,
  })
  ativo: boolean;

  @ApiProperty({
    description: 'Endereço do freelancer',
    type: AddressResponseDto,
  })
  endereco: AddressResponseDto;

  @ApiProperty({
    description: 'Roles/permissões do freelancer',
    enum: Role,
    isArray: true,
    example: ['Freelancer'],
  })
  roles: Role[];

  // Campo senha - APENAS para uso interno no AuthService
  // Nunca deve ser exposto na API pública
  senha?: string;
}

import { IsString, IsNotEmpty, IsOptional, IsEmail, Length, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../auth/roles/roles.enum';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export class CreateFreelancerDto {
  @ApiProperty({
    description: 'Nome do freelancer',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nome: string;

  @ApiProperty({
    description: 'Email do freelancer',
    example: 'joao@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do freelancer',
    example: 'minhasenha123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  senha: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do freelancer',
    example: '123.456.789-00 ou 12.345.678/0001-90',
  })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiProperty({
    description: 'Endereço do freelancer',
    type: CreateAddressDto,
  })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty()
  endereco: CreateAddressDto;

  @ApiProperty({
    description: 'Roles do freelancer',
    example: ['Freelancer'],
    enum: Role,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  roles?: Role[];
}

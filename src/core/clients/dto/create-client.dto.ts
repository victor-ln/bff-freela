import { IsString, IsNotEmpty, IsOptional, IsEmail, Length, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export class CreateClientDto {
  @ApiProperty({
    description: 'Status do cliente',
    example: 'Ativo',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Nome ou Razão Social do cliente',
    example: 'João Silva ou Empresa LTDA',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 200)
  nomeRazaoSocial: string;

  @ApiProperty({
    description: 'Nome da pessoa responsável',
    example: 'Maria Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  responsavel?: string;

  @ApiProperty({
    description: 'Telefone principal',
    example: '(11) 99999-9999',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
  })
  telefonePrincipal: string;

  @ApiProperty({
    description: 'Telefone secundário',
    example: '(11) 8888-8888',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
  })
  telefoneSecundario?: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do cliente',
    example: '123.456.789-00 ou 12.345.678/0001-90',
  })
  @IsString()
  @IsNotEmpty()
  cpfCnpj: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'cliente@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Endereço do cliente',
    type: CreateAddressDto,
  })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty()
  endereco: CreateAddressDto;
}

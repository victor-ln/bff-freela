import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nome da role',
    example: 'Freelancer Premium',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Descrição da role',
    example: 'Freelancer com recursos premium',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @ApiProperty({
    description: 'Se a role está ativa',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}

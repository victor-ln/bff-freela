import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFreelancerRolesDto {
  @ApiProperty({
    description: 'Nomes das roles a serem atribuídas ao freelancer',
    example: ['Freelancer', 'Freelancer Premium'],
    type: [String],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'A lista de roles não pode ser vazia' })
  @IsString({ each: true })
  roleNames: string[];
}
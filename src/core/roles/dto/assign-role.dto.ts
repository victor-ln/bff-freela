import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    description: 'ID do freelancer',
    example: 1,
  })
  @IsNumber()
  freelancerId: number;

  @ApiProperty({
    description: 'IDs das roles a serem atribuídas',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  roleIds: number[];
}

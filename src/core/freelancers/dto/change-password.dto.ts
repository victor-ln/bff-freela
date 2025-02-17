import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual',
    example: 'senhaatual123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'Nova senha',
    example: 'novasenha123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50)
  newPassword: string;
}
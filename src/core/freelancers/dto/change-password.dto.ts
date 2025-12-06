import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Nova senha já criptografada (hash bcrypt)',
    example: '$2a$12$KIXqF5P.yZ8vW0X9QHxD7eJ5P9Y3XqZ8vW0X9QHxD7eJ5P9Y3XqZ',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  novaSenhaHash: string;
}

import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptProposalDto {
  @ApiProperty({
    description: 'URL ou caminho da evidência de aceite (captura de tela, etc.)',
    example: '/uploads/evidencias/aceite-cliente-123.png',
  })
  @IsString()
  @IsNotEmpty()
  evidenciaAceite: string;
}

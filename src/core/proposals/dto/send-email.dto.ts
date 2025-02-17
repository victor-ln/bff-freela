import { IsString, IsNotEmpty, IsOptional, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Email do destinatário',
    example: 'cliente@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  emailDestinatario: string;

  @ApiProperty({
    description: 'Assunto do email',
    example: 'Contrato - Desenvolvimento Website Corporativo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  assunto: string;

  @ApiProperty({
    description: 'Mensagem personalizada do email',
    example: 'Segue em anexo o contrato para análise e assinatura.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  mensagem: string;

  @ApiProperty({
    description: 'Caminho do contrato personalizado (se houver)',
    example: '/uploads/contratos/contrato-editado-123.docx',
    required: false,
  })
  @IsOptional()
  @IsString()
  contratoPersonalizado?: string;
}

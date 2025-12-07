import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({
    description: 'Total de clientes cadastrados pelo freelancer',
    example: 10,
  })
  totalClientes: number;

  @ApiProperty({
    description: 'Quantidade de contratos/projetos em andamento',
    example: 5,
  })
  projetosAtivos: number;

  @ApiProperty({
    description: 'Quantidade de propostas enviadas mas ainda não aceitas/recusadas',
    example: 3,
  })
  propostasPendentes: number;

  @ApiProperty({
    description: 'Soma total dos valores dos contratos ativos no mês',
    example: 15000.50,
  })
  receitaMensal: number;
}
export interface Kanban {
  id: number;
  titulo: string;
  descricao?: string;
  propostaId: number;
  colunas: string[];
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
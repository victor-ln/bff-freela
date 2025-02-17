import { TemplateStatus } from "../enums/template-status.enum";

export interface Template {
  id: number;
  nome: string;
  anexo: string;
  status: TemplateStatus;
  dataCriacao: Date;
  dataAtualizacao: Date;
  createdAt: Date;
  updatedAt: Date;
}

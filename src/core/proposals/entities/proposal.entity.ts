import { ContractStatus } from '../enums/contract-status.enum';
import { ProposalStatus } from '../enums/proposal-status.enum';

export interface Proposal {
  id: number;
  titulo: string;
  descricao: string;
  clienteId: number;
  servicosIds: number[];
  templateId: number;
  valorTotal: number;
  status: ProposalStatus;
  contratoStatus: ContractStatus;
  observacoes?: string;
  evidenciaAceite?: string;
  contratoGerado?: string;
  contratoEditado?: string;
  dataEdicaoContrato?: Date;
  emailEnviado?: boolean;
  dataEnvioEmail?: Date;
  createdAt: Date;
  updatedAt: Date;
}

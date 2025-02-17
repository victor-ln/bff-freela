import { ServiceStatus } from "../enums/service-status.enum";
import { TimeUnit } from "../enums/time-unit.enum";

export interface Service {
  id: number;
  nome: string;
  descricao: string;
  categoriaId: number;
  prazoEntrega: number;
  unidadeTempoEntrega: TimeUnit;
  templateBaseId: number;
  status: ServiceStatus;
  precoBase: number;
  createdAt: Date;
  updatedAt: Date;
}

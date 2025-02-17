import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  dataInicio?: Date;
  dataVencimento: Date;
  dataConclusao?: Date;
  estimativaHoras?: number;
  horasGastas?: number;
  tags: string[];
  kanbanId: number;
  ordem: number;
  bloqueada: boolean;
  motivoBloqueio?: string;
  createdAt: Date;
  updatedAt: Date;
}
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateKanbanDto } from './dto/create-kanban.dto';
import { UpdateKanbanDto } from './dto/update-kanban.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { KanbanResponseDto } from './dto/kanban-response.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { BlockTaskDto } from './dto/block-task.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { TaskStatus } from './enums/task-status.enum';
import { TaskPriority } from './enums/task-priority.enum';

@Injectable()
export class KanbansService {
  private readonly logger = new Logger(KanbansService.name);

  constructor(private readonly backendService: BackendService) {}

  // ==================== KANBAN OPERATIONS ====================

  create(createKanbanDto: CreateKanbanDto): Observable<KanbanResponseDto> {
    this.logger.log(`Creating new kanban: ${createKanbanDto.titulo}`);
    return this.backendService.post<KanbanResponseDto>('/kanbans', createKanbanDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<KanbanResponseDto>> {
    this.logger.log(`Fetching kanbans with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<KanbanResponseDto>>(`/kanbans?${queryParams}`);
  }

  findOne(id: number): Observable<KanbanResponseDto> {
    this.logger.log(`Fetching kanban with id: ${id}`);
    return this.backendService.get<KanbanResponseDto>(`/kanbans/${id}`);
  }

  findByProposal(propostaId: number): Observable<KanbanResponseDto> {
    this.logger.log(`Fetching kanban for proposal: ${propostaId}`);
    return this.backendService.get<KanbanResponseDto>(`/kanbans/proposal/${propostaId}`);
  }

  findActive(): Observable<KanbanResponseDto[]> {
    this.logger.log('Fetching active kanbans');
    return this.backendService.get<KanbanResponseDto[]>('/kanbans/active');
  }

  update(id: number, updateKanbanDto: UpdateKanbanDto): Observable<KanbanResponseDto> {
    this.logger.log(`Updating kanban with id: ${id}`);
    return this.backendService.put<KanbanResponseDto>(`/kanbans/${id}`, updateKanbanDto);
  }

  deactivate(id: number): Observable<KanbanResponseDto> {
    this.logger.log(`Deactivating kanban with id: ${id}`);
    return this.backendService.patch<KanbanResponseDto>(`/kanbans/${id}/deactivate`, {});
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing kanban with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/kanbans/${id}`);
  }

  // ==================== TASK OPERATIONS ====================

  createTask(createTaskDto: CreateTaskDto): Observable<TaskResponseDto> {
    this.logger.log(`Creating new task: ${createTaskDto.titulo} for kanban ${createTaskDto.kanbanId}`);
    return this.backendService.post<TaskResponseDto>('/kanbans/tasks', createTaskDto);
  }

  findAllTasks(kanbanId: number): Observable<TaskResponseDto[]> {
    this.logger.log(`Fetching all tasks for kanban: ${kanbanId}`);
    return this.backendService.get<TaskResponseDto[]>(`/kanbans/${kanbanId}/tasks`);
  }

  findTasksByStatus(kanbanId: number, status: TaskStatus): Observable<TaskResponseDto[]> {
    this.logger.log(`Fetching tasks by status ${status} for kanban: ${kanbanId}`);
    return this.backendService.get<TaskResponseDto[]>(`/kanbans/${kanbanId}/tasks/status/${status}`);
  }

  findTasksByPriority(kanbanId: number, priority: TaskPriority): Observable<TaskResponseDto[]> {
    this.logger.log(`Fetching tasks by priority ${priority} for kanban: ${kanbanId}`);
    return this.backendService.get<TaskResponseDto[]>(`/kanbans/${kanbanId}/tasks/priority/${priority}`);
  }

  findOverdueTasks(kanbanId: number): Observable<TaskResponseDto[]> {
    this.logger.log(`Fetching overdue tasks for kanban: ${kanbanId}`);
    return this.backendService.get<TaskResponseDto[]>(`/kanbans/${kanbanId}/tasks/overdue`);
  }

  findTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    this.logger.log(`Fetching task ${taskId} from kanban: ${kanbanId}`);
    return this.backendService.get<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}`);
  }

  updateTask(kanbanId: number, taskId: number, updateTaskDto: UpdateTaskDto): Observable<TaskResponseDto> {
    this.logger.log(`Updating task ${taskId} from kanban: ${kanbanId}`);
    return this.backendService.put<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}`, updateTaskDto);
  }

  moveTask(kanbanId: number, taskId: number, moveTaskDto: MoveTaskDto): Observable<TaskResponseDto> {
    this.logger.log(`Moving task ${taskId} to ${moveTaskDto.novoStatus} in kanban: ${kanbanId}`);
    return this.backendService.patch<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}/move`, moveTaskDto);
  }

  blockTask(kanbanId: number, taskId: number, blockTaskDto: BlockTaskDto): Observable<TaskResponseDto> {
    this.logger.log(`Blocking task ${taskId} in kanban: ${kanbanId}`);
    return this.backendService.patch<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}/block`, blockTaskDto);
  }

  unblockTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    this.logger.log(`Unblocking task ${taskId} in kanban: ${kanbanId}`);
    return this.backendService.patch<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}/unblock`, {});
  }

  completeTask(kanbanId: number, taskId: number): Observable<TaskResponseDto> {
    this.logger.log(`Completing task ${taskId} in kanban: ${kanbanId}`);
    return this.backendService.patch<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}/complete`, {});
  }

  addTimeToTask(kanbanId: number, taskId: number, hours: number): Observable<TaskResponseDto> {
    this.logger.log(`Adding ${hours} hours to task ${taskId} in kanban: ${kanbanId}`);
    return this.backendService.patch<TaskResponseDto>(`/kanbans/${kanbanId}/tasks/${taskId}/add-time`, { hours });
  }

  removeTask(kanbanId: number, taskId: number): Observable<{ message: string }> {
    this.logger.log(`Removing task ${taskId} from kanban: ${kanbanId}`);
    return this.backendService.delete<{ message: string }>(`/kanbans/${kanbanId}/tasks/${taskId}`);
  }

  // ==================== ANALYTICS AND METRICS ====================

  getKanbanMetrics(id: number): Observable<any> {
    this.logger.log(`Fetching metrics for kanban: ${id}`);
    return this.backendService.get<any>(`/kanbans/${id}/metrics`);
  }

  getTasksProgress(id: number): Observable<any> {
    this.logger.log(`Fetching tasks progress for kanban: ${id}`);
    return this.backendService.get<any>(`/kanbans/${id}/progress`);
  }

  // ==================== BULK OPERATIONS ====================

  bulkCreateTasks(kanbanId: number, tasks: CreateTaskDto[]): Observable<TaskResponseDto[]> {
    this.logger.log(`Bulk creating ${tasks.length} tasks for kanban: ${kanbanId}`);
    return this.backendService.post<TaskResponseDto[]>(`/kanbans/${kanbanId}/tasks/bulk`, { tasks });
  }

  bulkUpdateTasksOrder(kanbanId: number, tasksOrder: { taskId: number; ordem: number; status: TaskStatus }[]): Observable<TaskResponseDto[]> {
    this.logger.log(`Bulk updating task order for kanban: ${kanbanId}`);
    return this.backendService.patch<TaskResponseDto[]>(`/kanbans/${kanbanId}/tasks/bulk-order`, { tasksOrder });
  }

  // ==================== TEMPLATE OPERATIONS ====================

  createKanbanFromTemplate(propostaId: number, templateName: string): Observable<KanbanResponseDto> {
    this.logger.log(`Creating kanban from template ${templateName} for proposal: ${propostaId}`);
    return this.backendService.post<KanbanResponseDto>('/kanbans/from-template', { propostaId, templateName });
  }

  duplicateKanban(id: number, newTitle: string): Observable<KanbanResponseDto> {
    this.logger.log(`Duplicating kanban ${id} with new title: ${newTitle}`);
    return this.backendService.post<KanbanResponseDto>(`/kanbans/${id}/duplicate`, { newTitle });
  }

  // ==================== REPORTING ====================

  exportKanbanData(id: number, format: 'csv' | 'excel' | 'json' = 'json'): Observable<Blob> {
    this.logger.log(`Exporting kanban ${id} data in ${format} format`);
    return this.backendService.get<Blob>(`/kanbans/${id}/export?format=${format}`);
  }

  getTimeTracking(kanbanId: number, startDate?: string, endDate?: string): Observable<any> {
    this.logger.log(`Fetching time tracking for kanban: ${kanbanId}`);
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const query = queryParams.toString() ? `?${queryParams}` : '';
    return this.backendService.get<any>(`/kanbans/${kanbanId}/time-tracking${query}`);
  }

  getProductivityMetrics(kanbanId: number, period: 'week' | 'month' | 'quarter' = 'month'): Observable<any> {
    this.logger.log(`Fetching productivity metrics for kanban ${kanbanId} for period: ${period}`);
    return this.backendService.get<any>(`/kanbans/${kanbanId}/productivity?period=${period}`);
  }
}

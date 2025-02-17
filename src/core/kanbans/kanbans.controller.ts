import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { KanbansService } from './kanbans.service';
import { CreateKanbanDto } from './dto/create-kanban.dto';
import { UpdateKanbanDto } from './dto/update-kanban.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../auth/roles/roles.enum';
import { TaskPriority } from './enums/task-priority.enum';
import { KanbanResponseDto } from './dto/kanban-response.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { MoveTaskDto } from './dto/move-task.dto';
import { BlockTaskDto } from './dto/block-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('kanbans')
@ApiBearerAuth()
@Controller('kanbans')
export class KanbansController {
  constructor(private readonly kanbansService: KanbansService) {}

  // ==================== KANBAN ENDPOINTS ====================
  
  @Post()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar um novo quadro Kanban' })
  @ApiResponse({ 
    status: 201, 
    description: 'Kanban criado com sucesso',
    type: KanbanResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proposta não encontrada' 
  })
  create(@Body() createKanbanDto: CreateKanbanDto): Observable<KanbanResponseDto> {
    return this.kanbansService.create(createKanbanDto);
  }

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos os quadros Kanban com paginação' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Website' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de quadros Kanban recuperada com sucesso',
    type: PaginatedResponseDto<KanbanResponseDto>
  })
  findAll(@Query() pagination: PaginationDto): Observable<PaginatedResponseDto<KanbanResponseDto>> {
    return this.kanbansService.findAll(pagination);
  }

  @Get('active')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar quadros Kanban ativos' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de quadros Kanban ativos',
    type: [KanbanResponseDto]
  })
  findActive(): Observable<KanbanResponseDto[]> {
    return this.kanbansService.findActive();
  }

  @Get('proposal/:propostaId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar Kanban por proposta' })
  @ApiParam({ name: 'propostaId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Kanban da proposta encontrado',
    type: KanbanResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Kanban não encontrado para esta proposta' 
  })
  findByProposal(@Param('propostaId', ParseIntPipe) propostaId: number): Observable<KanbanResponseDto> {
    return this.kanbansService.findByProposal(propostaId);
  }

  @Get(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar quadro Kanban por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Kanban encontrado',
    type: KanbanResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Kanban não encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<KanbanResponseDto> {
    return this.kanbansService.findOne(id);
  }

  @Get(':id/metrics')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Obter métricas do Kanban' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Métricas do Kanban' 
  })
  getMetrics(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.kanbansService.getKanbanMetrics(id);
  }

  @Get(':id/progress')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Obter progresso das tarefas' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Progresso das tarefas' 
  })
  getProgress(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.kanbansService.getTasksProgress(id);
  }

  @Patch(':id')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar quadro Kanban' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Kanban atualizado com sucesso',
    type: KanbanResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Kanban não encontrado' 
  })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateKanbanDto: UpdateKanbanDto
  ): Observable<KanbanResponseDto> {
    return this.kanbansService.update(id, updateKanbanDto);
  }

  @Patch(':id/deactivate')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Desativar quadro Kanban' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Kanban desativado com sucesso',
    type: KanbanResponseDto 
  })
  deactivate(@Param('id', ParseIntPipe) id: number): Observable<KanbanResponseDto> {
    return this.kanbansService.deactivate(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover quadro Kanban' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Kanban removido com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Kanban não encontrado' 
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<{ message: string }> {
    return this.kanbansService.remove(id);
  }

  // ==================== TASK ENDPOINTS ====================

  @Post(':id/tasks')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova tarefa no Kanban' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 201, 
    description: 'Tarefa criada com sucesso',
    type: TaskResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Kanban não encontrado' 
  })
  createTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Body() createTaskDto: CreateTaskDto
  ): Observable<TaskResponseDto> {
    // Garantir que o kanbanId do parâmetro é usado
    createTaskDto.kanbanId = kanbanId;
    return this.kanbansService.createTask(createTaskDto);
  }

  @Get(':id/tasks')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar todas as tarefas do Kanban' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarefas do Kanban',
    type: [TaskResponseDto]
  })
  findAllTasks(@Param('id', ParseIntPipe) kanbanId: number): Observable<TaskResponseDto[]> {
    return this.kanbansService.findAllTasks(kanbanId);
  }

  @Get(':id/tasks/status/:status')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar tarefas por status' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'status', enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarefas filtradas por status',
    type: [TaskResponseDto]
  })
  findTasksByStatus(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('status') status: TaskStatus
  ): Observable<TaskResponseDto[]> {
    return this.kanbansService.findTasksByStatus(kanbanId, status);
  }

  @Get(':id/tasks/priority/:priority')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar tarefas por prioridade' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'priority', enum: TaskPriority, example: TaskPriority.HIGH })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarefas filtradas por prioridade',
    type: [TaskResponseDto]
  })
  findTasksByPriority(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('priority') priority: TaskPriority
  ): Observable<TaskResponseDto[]> {
    return this.kanbansService.findTasksByPriority(kanbanId, priority);
  }

  @Get(':id/tasks/overdue')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Listar tarefas atrasadas' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de tarefas atrasadas',
    type: [TaskResponseDto]
  })
  findOverdueTasks(@Param('id', ParseIntPipe) kanbanId: number): Observable<TaskResponseDto[]> {
    return this.kanbansService.findOverdueTasks(kanbanId);
  }

  @Get(':id/tasks/:taskId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Buscar tarefa específica' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa encontrada',
    type: TaskResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  findTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number
  ): Observable<TaskResponseDto> {
    return this.kanbansService.findTask(kanbanId, taskId);
  }

  @Patch(':id/tasks/:taskId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa atualizada com sucesso',
    type: TaskResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Tarefa concluída não pode ser editada' 
  })
  updateTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto
  ): Observable<TaskResponseDto> {
    return this.kanbansService.updateTask(kanbanId, taskId, updateTaskDto);
  }

  @Patch(':id/tasks/:taskId/move')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Mover tarefa entre colunas' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa movida com sucesso',
    type: TaskResponseDto 
  })
  moveTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() moveTaskDto: MoveTaskDto
  ): Observable<TaskResponseDto> {
    return this.kanbansService.moveTask(kanbanId, taskId, moveTaskDto);
  }

  @Patch(':id/tasks/:taskId/block')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Bloquear tarefa' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa bloqueada com sucesso',
    type: TaskResponseDto 
  })
  blockTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() blockTaskDto: BlockTaskDto
  ): Observable<TaskResponseDto> {
    return this.kanbansService.blockTask(kanbanId, taskId, blockTaskDto);
  }

  @Patch(':id/tasks/:taskId/unblock')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Desbloquear tarefa' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa desbloqueada com sucesso',
    type: TaskResponseDto 
  })
  unblockTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number
  ): Observable<TaskResponseDto> {
    return this.kanbansService.unblockTask(kanbanId, taskId);
  }

  @Patch(':id/tasks/:taskId/complete')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Marcar tarefa como concluída' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Tarefa concluída com sucesso',
    type: TaskResponseDto 
  })
  completeTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number
  ): Observable<TaskResponseDto> {
    return this.kanbansService.completeTask(kanbanId, taskId);
  }

  @Patch(':id/tasks/:taskId/add-time')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @ApiOperation({ summary: 'Adicionar horas trabalhadas na tarefa' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Horas adicionadas com sucesso',
    type: TaskResponseDto 
  })
  addTimeToTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: { hours: number }
  ): Observable<TaskResponseDto> {
    return this.kanbansService.addTimeToTask(kanbanId, taskId, body.hours);
  }

  @Delete(':id/tasks/:taskId')
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover tarefa' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiParam({ name: 'taskId', type: Number, example: 1 })
  @ApiResponse({ 
    status: 204, 
    description: 'Tarefa removida com sucesso' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tarefa não encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Tarefa concluída não pode ser removida' 
  })
  removeTask(
    @Param('id', ParseIntPipe) kanbanId: number,
    @Param('taskId', ParseIntPipe) taskId: number
  ): Observable<{ message: string }> {
    return this.kanbansService.removeTask(kanbanId, taskId);
  }
}

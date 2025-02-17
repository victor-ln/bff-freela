import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateResponseDto } from './dto/template-response.dto';
import { ApproveTemplateDto } from './dto/approve-template.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { TemplateStatus } from './enums/template-status.enum';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createTemplateDto: CreateTemplateDto): Observable<TemplateResponseDto> {
    this.logger.log(`Creating new template: ${createTemplateDto.nome}`);
    return this.backendService.post<TemplateResponseDto>('/templates', createTemplateDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<TemplateResponseDto>> {
    this.logger.log(`Fetching templates with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<TemplateResponseDto>>(`/templates?${queryParams}`);
  }

  findByStatus(status: TemplateStatus): Observable<TemplateResponseDto[]> {
    this.logger.log(`Fetching templates by status: ${status}`);
    return this.backendService.get<TemplateResponseDto[]>(`/templates/by-status/${status}`);
  }

  findApproved(): Observable<TemplateResponseDto[]> {
    this.logger.log('Fetching approved templates');
    return this.backendService.get<TemplateResponseDto[]>(`/templates/approved`);
  }

  findOne(id: number): Observable<TemplateResponseDto> {
    this.logger.log(`Fetching template with id: ${id}`);
    return this.backendService.get<TemplateResponseDto>(`/templates/${id}`);
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto): Observable<TemplateResponseDto> {
    this.logger.log(`Updating template with id: ${id}`);
    return this.backendService.put<TemplateResponseDto>(`/templates/${id}`, updateTemplateDto);
  }

  approve(id: number, approveTemplateDto: ApproveTemplateDto): Observable<TemplateResponseDto> {
    this.logger.log(`Changing template ${id} status to: ${approveTemplateDto.status}`);
    return this.backendService.patch<TemplateResponseDto>(`/templates/${id}/approve`, approveTemplateDto);
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing template with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/templates/${id}`);
  }

  downloadTemplate(id: number): Observable<Blob> {
    this.logger.log(`Downloading template with id: ${id}`);
    return this.backendService.get<Blob>(`/templates/${id}/download`);
  }
}

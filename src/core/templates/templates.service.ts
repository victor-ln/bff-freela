import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Response } from 'express';
import FormData from 'form-data';
import { BackendService } from '../../common/http/backend.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateResponseDto } from './dto/template-response.dto';
import { ApproveTemplateDto } from './dto/approve-template.dto';
import { UploadTemplateDto } from './dto/upload-template.dto';
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
    const queryParams = new URLSearchParams({
      status: status,
      limit: '1000',
    });
    return this.backendService.get<any>(`/templates?${queryParams}`)
      .pipe(map(response => response.dados?.data || []));
  }

  findApproved(): Observable<TemplateResponseDto[]> {
    this.logger.log('Fetching approved templates');
    const queryParams = new URLSearchParams({
      status: TemplateStatus.APPROVED,
      limit: '1000',
    });
    return this.backendService.get<any>(`/templates?${queryParams}`)
      .pipe(map(response => response.dados?.data || []));
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

  uploadTemplate(file: any, uploadDto: UploadTemplateDto): Observable<TemplateResponseDto> {
    this.logger.log(`Uploading template: ${uploadDto.nome}`);

    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    if (!file.originalname.toLowerCase().endsWith('.docx')) {
      throw new BadRequestException('Apenas arquivos DOCX são permitidos');
    }

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('nome', uploadDto.nome);
    formData.append('descricao', uploadDto.descricao || '');
    formData.append('freelancerId', uploadDto.freelancerId.toString());

    return this.backendService.postMultipart<TemplateResponseDto>('/templates/upload', formData);
  }

  downloadTemplate(id: number, res: Response): void {
    this.logger.log(`Downloading template with id: ${id}`);

    this.backendService.getStream(`/templates/${id}/download`).subscribe({
      next: (response) => {
        res.set({
          'Content-Type': response.headers['content-type'] || 'application/octet-stream',
          'Content-Disposition': response.headers['content-disposition'] || `attachment; filename="template_${id}.docx"`,
        });
        response.data.pipe(res);
      },
      error: (error) => {
        this.logger.error(`Error downloading template ${id}:`, error.message);
        res.status(error.status || 500).json({
          message: error.message || 'Erro ao baixar template',
        });
      },
    });
  }
}

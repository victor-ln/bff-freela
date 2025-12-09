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
    // O Backend espera POST /templates
    return this.backendService.post<any>('/templates', createTemplateDto)
      .pipe(map(response => response.dados)); // Extrai o objeto 'dados' do wrapper
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<TemplateResponseDto>> {
    this.logger.log(`Fetching templates with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
      // O backend Java aceita 'freelancerId' e 'status' aqui também, se necessário passar no futuro
    });

    return this.backendService.get<PaginatedResponseDto<TemplateResponseDto>>(`/templates?${queryParams}`);
  }

  findByStatus(status: TemplateStatus): Observable<TemplateResponseDto[]> {
    this.logger.log(`Fetching templates by status: ${status}`);
    
    // Converte o status para o formato esperado pelo Java (ex: APPROVED -> APROVADO)
    const backendStatus = this.mapStatusToBackend(status);

    const queryParams = new URLSearchParams({
      status: backendStatus,
      limit: '1000',
    });
    
    return this.backendService.get<any>(`/templates?${queryParams}`)
      .pipe(map(response => response.dados || []));
  }

  findApproved(): Observable<TemplateResponseDto[]> {
    this.logger.log('Fetching approved templates');
    const queryParams = new URLSearchParams({
      status: 'APROVADO', // Valor fixo esperado pelo Backend Java
      limit: '1000',
    });
    return this.backendService.get<any>(`/templates?${queryParams}`)
      .pipe(map(response => response.dados || []));
  }

  findOne(id: number): Observable<TemplateResponseDto> {
    this.logger.log(`Fetching template with id: ${id}`);
    return this.backendService.get<any>(`/templates/${id}`)
      .pipe(map(response => response.dados));
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto): Observable<TemplateResponseDto> {
    this.logger.log(`Updating template with id: ${id}`);
    return this.backendService.put<any>(`/templates/${id}`, updateTemplateDto)
      .pipe(map(response => response.dados));
  }

  approve(id: number, approveTemplateDto: ApproveTemplateDto): Observable<TemplateResponseDto> {
    this.logger.log(`Changing template ${id} status to: ${approveTemplateDto.status}`);

    // Mapeia para o valor esperado pelo Java (APROVADO, REJEITADO, EM_REVISAO)
    const backendStatus = this.mapStatusToBackend(approveTemplateDto.status);

    // Rota correta conforme Java: PATCH /templates/{id}/status
    // Body esperado: { "status": "VALOR" }
    return this.backendService.patch<any>(`/templates/${id}/status`, {
      status: backendStatus
    }).pipe(map(response => response.dados));
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

    return this.backendService.postMultipart<any>('/templates/upload', formData)
      .pipe(map(response => response.dados));
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

  /**
   * Helper para garantir que enviamos os status em Português conforme esperado pelo validador Java:
   * if (!status.equals("APROVADO") && !status.equals("REJEITADO") && !status.equals("EM_REVISAO"))
   */
  private mapStatusToBackend(status: string | TemplateStatus): string {
    const s = status.toString().toUpperCase();
    
    // Se já estiver em português, retorna
    if (['APROVADO', 'REJEITADO', 'EM_REVISAO'].includes(s)) {
      return s;
    }

    // Mapeamento de Inglês/Enum BFF -> Português Backend
    const map: Record<string, string> = {
      'APPROVED': 'APROVADO',
      'REJECTED': 'REJEITADO',
      'UNDER_REVIEW': 'EM_REVISAO',
      'REVIEW': 'EM_REVISAO',
      'PENDING': 'EM_REVISAO' // Fallback comum
    };

    return map[s] || 'EM_REVISAO';
  }
}
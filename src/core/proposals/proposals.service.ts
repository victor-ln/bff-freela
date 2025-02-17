import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BackendService } from '../../common/http/backend.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { ProposalResponseDto } from './dto/proposal-response.dto';
import { AcceptProposalDto } from './dto/accept-proposal.dto';
import { GenerateContractDto } from './dto/generate-contract.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ProposalStatus } from './enums/proposal-status.enum';

@Injectable()
export class ProposalsService {
  private readonly logger = new Logger(ProposalsService.name);

  constructor(private readonly backendService: BackendService) {}

  create(createProposalDto: CreateProposalDto): Observable<ProposalResponseDto> {
    this.logger.log(`Creating new proposal: ${createProposalDto.titulo}`);
    return this.backendService.post<ProposalResponseDto>('/proposals', createProposalDto);
  }

  findAll(pagination: PaginationDto): Observable<PaginatedResponseDto<ProposalResponseDto>> {
    this.logger.log(`Fetching proposals with pagination: page=${pagination.page}, limit=${pagination.limit}`);
    
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.search && { search: pagination.search }),
    });

    return this.backendService.get<PaginatedResponseDto<ProposalResponseDto>>(`/proposals?${queryParams}`);
  }

  findByStatus(status: ProposalStatus): Observable<ProposalResponseDto[]> {
    this.logger.log(`Fetching proposals by status: ${status}`);
    return this.backendService.get<ProposalResponseDto[]>(`/proposals/by-status/${status}`);
  }

  findByClient(clienteId: number): Observable<ProposalResponseDto[]> {
    this.logger.log(`Fetching proposals for client: ${clienteId}`);
    return this.backendService.get<ProposalResponseDto[]>(`/proposals/client/${clienteId}`);
  }

  findAccepted(): Observable<ProposalResponseDto[]> {
    this.logger.log('Fetching accepted proposals');
    return this.backendService.get<ProposalResponseDto[]>('/proposals/accepted');
  }

  findDrafts(): Observable<ProposalResponseDto[]> {
    this.logger.log('Fetching draft proposals');
    return this.backendService.get<ProposalResponseDto[]>('/proposals/drafts');
  }

  findOne(id: number): Observable<ProposalResponseDto> {
    this.logger.log(`Fetching proposal with id: ${id}`);
    return this.backendService.get<ProposalResponseDto>(`/proposals/${id}`);
  }

  update(id: number, updateProposalDto: UpdateProposalDto): Observable<ProposalResponseDto> {
    this.logger.log(`Updating proposal with id: ${id}`);
    return this.backendService.put<ProposalResponseDto>(`/proposals/${id}`, updateProposalDto);
  }

  acceptProposal(id: number, acceptProposalDto: AcceptProposalDto): Observable<ProposalResponseDto> {
    this.logger.log(`Accepting proposal with id: ${id}`);
    return this.backendService.patch<ProposalResponseDto>(`/proposals/${id}/accept`, acceptProposalDto);
  }

  rejectProposal(id: number, reason?: string): Observable<ProposalResponseDto> {
    this.logger.log(`Rejecting proposal with id: ${id}`);
    return this.backendService.patch<ProposalResponseDto>(`/proposals/${id}/reject`, { reason });
  }

  generateContract(id: number, generateContractDto?: GenerateContractDto): Observable<ProposalResponseDto> {
    this.logger.log(`Generating contract for proposal: ${id}`);
    return this.backendService.post<ProposalResponseDto>(`/proposals/${id}/generate-contract`, generateContractDto || {});
  }

  downloadContract(id: number, format: 'pdf' | 'docx' = 'docx'): Observable<Blob> {
    this.logger.log(`Downloading contract for proposal ${id} in ${format} format`);
    return this.backendService.get<Blob>(`/proposals/${id}/contract/download?format=${format}`);
  }

  uploadEditedContract(id: number, contractFile: string): Observable<ProposalResponseDto> {
    this.logger.log(`Uploading edited contract for proposal: ${id}`);
    return this.backendService.post<ProposalResponseDto>(`/proposals/${id}/upload-edited-contract`, { contractFile });
  }

  sendContractEmail(id: number, sendEmailDto: SendEmailDto): Observable<{ message: string }> {
    this.logger.log(`Sending contract email for proposal: ${id}`);
    return this.backendService.post<{ message: string }>(`/proposals/${id}/send-email`, sendEmailDto);
  }

  attachSignedContract(id: number, signedContractFile: string): Observable<ProposalResponseDto> {
    this.logger.log(`Attaching signed contract for proposal: ${id}`);
    return this.backendService.post<ProposalResponseDto>(`/proposals/${id}/attach-signed-contract`, { signedContractFile });
  }

  toggleStatus(id: number, status: ProposalStatus): Observable<ProposalResponseDto> {
    this.logger.log(`Changing proposal ${id} status to: ${status}`);
    return this.backendService.patch<ProposalResponseDto>(`/proposals/${id}/status`, { status });
  }

  remove(id: number): Observable<{ message: string }> {
    this.logger.log(`Removing proposal with id: ${id}`);
    return this.backendService.delete<{ message: string }>(`/proposals/${id}`);
  }

  getProposalMetrics(): Observable<any> {
    this.logger.log('Fetching proposal metrics');
    return this.backendService.get<any>('/proposals/metrics');
  }
}

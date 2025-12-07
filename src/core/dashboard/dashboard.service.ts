import { Injectable } from '@nestjs/common';
import { BackendService } from '../../common/http/backend.service';
import { Observable, map } from 'rxjs';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly backendService: BackendService) {}

  // Mude o retorno de Observable<any> para Observable<DashboardResponseDto>
  getStats(userId: number): Observable<DashboardResponseDto> {
    return this.backendService.get<any>(`/dashboard/${userId}`).pipe(
      map(response => {
        // O backend Java retorna { data: {...}, message: "..." } ou dados puros dependendo do handler
        // Se usar o ResponseHandler padrão do seu projeto, os dados vêm dentro de 'dados'
        const data = response.dados || response;
        console.log('Dashboard data stats from backend:', data);
        
        // Mapeamento manual (opcional, mas garante que o DTO do BFF esteja limpo)
        const dto = new DashboardResponseDto();
        dto.totalClientes = data.totalClientes;
        dto.projetosAtivos = data.projetosAtivos;
        dto.propostasPendentes = data.propostasPendentes;
        dto.receitaMensal = data.receitaMensal;
        
        return dto;
      })
    );
  }
}
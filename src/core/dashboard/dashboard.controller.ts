import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import type { AuthenticatedUser } from 'src/auth/strategies/jwt.strategy';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.FREELANCER, Role.FREELANCER_PREMIUM)
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  // Adicione a resposta tipada para o Swagger
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do dashboard recuperados com sucesso',
    type: DashboardResponseDto 
  })
  getStats(@CurrentUser() user: AuthenticatedUser): Observable<DashboardResponseDto> {
    return this.dashboardService.getStats(user.userId);
  }
}
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/roles/roles.decorator';
import { AuthenticatedUser } from 'src/auth/strategies/jwt.strategy';
import { Role } from 'src/auth/roles/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: any = request.user; // Usando any aqui temporariamente para flexibilidade no acesso às roles

    console.log("Usuário no Guard:", user);

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!user.roles || user.roles.length === 0) {
      throw new ForbiddenException('Usuário sem permissões definidas');
    }

    const userRoleNames = user.roles.map((role: any) => {
      return typeof role === 'string' ? role : role.nome;
    });

    console.log("Roles extraídas:", userRoleNames);
    console.log("Roles necessárias:", requiredRoles);

    const hasRole = requiredRoles.some((role) => userRoleNames.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Roles necessárias: ${requiredRoles.join(', ')}. ` +
        `Roles do usuário: ${userRoleNames.join(', ')}`,
      );
    }

    return true;
  }
}

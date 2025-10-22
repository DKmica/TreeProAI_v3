import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

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
    const { userRole } = context.switchToHttp().getRequest();
    if (!userRole) {
        throw new ForbiddenException('User role not found on request.');
    }

    const hasRole = () => requiredRoles.some((role) => userRole.includes(role));

    if (!hasRole()) {
        throw new ForbiddenException(`Insufficient role. Required: ${requiredRoles.join(', ')}`);
    }
    
    return true;
  }
}
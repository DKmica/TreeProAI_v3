import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Reflector } from "@nestjs/common";
import { ROLES_KEY, Role } from "../decorators/roles.decorator";

export function hasRole(userRole: Role, allowed: Role[]) {
  return allowed.includes(userRole);
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!roles || roles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as { role?: Role } | undefined;
    if (!user?.role) {
      throw new ForbiddenException("User role missing");
    }
    if (!hasRole(user.role, roles)) {
      throw new ForbiddenException("Insufficient role");
    }
    return true;
  }
}
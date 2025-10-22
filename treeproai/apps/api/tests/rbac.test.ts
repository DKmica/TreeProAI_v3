import { describe, it, expect, vi } from 'vitest';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  const reflector = new Reflector();
  const guard = new RolesGuard(reflector);

  const createMockContext = (userRole: string | undefined, requiredRoles: string[] | undefined) => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
    return {
      switchToHttp: () => ({
        getRequest: () => ({ userRole }),
      }),
      getHandler: () => {},
      getClass: () => {},
    } as unknown as ExecutionContext;
  };

  it('should allow access if no roles are required', () => {
    const context = createMockContext('member', undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has the required role', () => {
    const context = createMockContext('owner', ['owner']);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access if user does not have the required role', () => {
    const context = createMockContext('member', ['owner', 'admin']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access if user role is not present on request', () => {
    const context = createMockContext(undefined, ['member']);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
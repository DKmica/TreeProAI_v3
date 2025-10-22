import { SetMetadata } from '@nestjs/common';

export type Role = 'owner' | 'admin' | 'member'; // Clerk roles are 'org:owner', 'org:admin', 'org:member'
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
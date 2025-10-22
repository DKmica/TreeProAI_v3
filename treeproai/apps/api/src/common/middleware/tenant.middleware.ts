import { Injectable, NestMiddleware, BadRequestException, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/clerk-sdk-node";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const companyId = req.header("x-company-id");
    if (!companyId) {
      throw new BadRequestException("x-company-id header is required");
    }

    const auth = getAuth(req);
    if (!auth.userId) {
      throw new ForbiddenException("User not authenticated.");
    }

    // Verify the user is a member of the organization they claim to be
    const orgMemberships = await auth.user.getOrganizationMembershipList();
    const isMember = orgMemberships.some(mem => mem.organization.id === companyId);

    if (!isMember) {
        throw new ForbiddenException(`User is not a member of company ${companyId}`);
    }

    // Attach companyId and user role to the request for downstream use
    const membership = orgMemberships.find(mem => mem.organization.id === companyId);
    req.companyId = companyId;
    req.userRole = membership.role.replace('org:', ''); // Clerk roles are like 'org:owner'

    next();
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      companyId?: string;
      userRole?: string;
    }
  }
}
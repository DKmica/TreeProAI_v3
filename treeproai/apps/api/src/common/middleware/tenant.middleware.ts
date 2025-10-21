import { Injectable, NestMiddleware, BadRequestException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      companyId?: string;
      user?: { id: string; role: "OWNER" | "MANAGER" | "SALES" | "CREW" };
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const companyId = req.header("x-company-id");
    if (!companyId) {
      throw new BadRequestException("x-company-id header is required");
    }
    req.companyId = companyId;
    next();
  }
}
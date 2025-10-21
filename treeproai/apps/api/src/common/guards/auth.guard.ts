import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyToken } from "@clerk/clerk-sdk-node";

/**
 * Auth strategy:
 * - If CLERK_SECRET_KEY is set, verify Bearer token via Clerk and extract userId.
 * - Role is derived from 'x-role' header for simplicity (RBAC managed internally), or defaults to MANAGER if not provided.
 * - If CLERK_SECRET_KEY is NOT set, allow dev mode: require 'x-dev-user' and 'x-role' headers.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.header("authorization");
    const roleHeader = req.header("x-role") as "OWNER" | "MANAGER" | "SALES" | "CREW" | undefined;

    if (process.env.CLERK_SECRET_KEY && auth?.startsWith("Bearer ")) {
      const token = auth.slice("Bearer ".length);
      try {
        const claims = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
        req.user = { id: claims.sub as string, role: (roleHeader ?? "MANAGER") as any };
        return true;
      } catch (_e) {
        throw new UnauthorizedException("Invalid token");
      }
    }

    // Dev fallback
    const devUser = req.header("x-dev-user");
    if (devUser && roleHeader) {
      req.user = { id: devUser, role: roleHeader as any };
      return true;
    }

    throw new UnauthorizedException("Missing or invalid auth");
  }
}
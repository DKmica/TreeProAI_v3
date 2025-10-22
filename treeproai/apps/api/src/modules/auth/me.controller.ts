import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getAuth } from "@clerk/clerk-sdk-node";
import { RolesGuard } from "@/common/guards/roles.guard";

@ApiTags("Auth")
@Controller({ path: "me", version: "1" })
@UseGuards(RolesGuard)
export class MeController {
  @Get()
  getMe(@Req() req: any) {
    const auth = getAuth(req);
    return {
      userId: auth.userId,
      companyId: req.companyId,
      role: req.userRole,
    };
  }
}
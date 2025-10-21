import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../common/guards/auth.guard";

@Controller("me")
@UseGuards(AuthGuard)
export class MeController {
  @Get()
  getMe(@Req() req: any) {
    return {
      user: req.user,
      companyId: req.companyId
    };
  }
}
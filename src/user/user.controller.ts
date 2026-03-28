import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private user: UserService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.user.getMe(req.user.userId);
  }

}

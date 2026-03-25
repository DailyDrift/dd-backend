import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.auth.register(dto.username, dto.password);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.auth.login(dto.username, dto.password);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  logout(@Req() req) {
    return this.auth.logout(req.user.userId);
  }
}

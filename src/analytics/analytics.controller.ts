import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtGuard)
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Get('water')
  getWater(@Req() req) {
    return this.analytics.getWaterCurrentMonth(req.user.userId);
  }

  @Get('sleep')
  getSleep(@Req() req) {
    return this.analytics.getSleepCurrentMonth(req.user.userId);
  }

  @Get('todos')
  getTodos(@Req() req) {
    return this.analytics.getTodosCurrentMonth(req.user.userId);
  }

  @Get('mood')
  getMood(@Req() req) {
    return this.analytics.getMoodCurrentMonth(req.user.userId);
  }

  @Get('workout')
  getWorkout(@Req() req) {
    return this.analytics.getWorkoutCurrentMonth(req.user.userId);
  }
}

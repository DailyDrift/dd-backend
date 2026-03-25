import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JournalService } from './journal.service';
import { UpsertJournalDto } from './dto/upsert-journal.dto';

@UseGuards(JwtGuard)
@Controller('journal')
export class JournalController {
  constructor(private journal: JournalService) {}

  @Post('today')
  upsertToday(@Req() req, @Body() dto: UpsertJournalDto) {
    return this.journal.upsertToday(req.user.userId, dto);
  }

  @Get('today')
  getToday(@Req() req) {
    return this.journal.getToday(req.user.userId);
  }
}

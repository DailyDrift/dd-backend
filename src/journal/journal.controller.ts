import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JournalService } from './journal.service';
import { UpsertJournalDto } from './dto/upsert-journal.dto';
import { UpdateTodoDto } from './dto/update.dto';

@UseGuards(JwtGuard)
@Controller({ path: 'journal', version: '1' })
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

  @Patch('todos/:id')
  updateTodo(@Req() req, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.journal.updateTodoStatus(req.user.userId, +id, dto.done);
  }
}

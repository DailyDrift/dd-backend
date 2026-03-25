import { Controller, Get } from '@nestjs/common';
import { QoutesService } from './qoutes.service';

@Controller('quotes')
export class QoutesController {
  constructor(private readonly quotesService: QoutesService) {}

  @Get('quoteOfTheDay')
  async quoteOfTheDay() {
    return this.quotesService.getQuoteOfTheDay();
  }

}

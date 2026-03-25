import { Controller, Get } from '@nestjs/common';
import { QoutesService } from './qoutes.service';

@Controller({ path: 'quotes', version: '1' })
export class QoutesController {
  constructor(private readonly quotesService: QoutesService) {}

  @Get('quoteOfTheDay')
  async quoteOfTheDay() {
    return this.quotesService.getQuoteOfTheDay();
  }
}

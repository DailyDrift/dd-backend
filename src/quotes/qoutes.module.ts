import { Module } from '@nestjs/common';
import { QoutesController } from './qoutes.controller';
import { QoutesService } from './qoutes.service';

@Module({
  controllers: [QoutesController],
  providers: [QoutesService]
})
export class QoutesModule {}

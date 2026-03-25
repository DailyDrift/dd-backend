import { Test, TestingModule } from '@nestjs/testing';
import { QoutesService } from './qoutes.service';

describe('QoutesService', () => {
  let service: QoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QoutesService],
    }).compile();

    service = module.get<QoutesService>(QoutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { QoutesController } from './qoutes.controller';

describe('QoutesController', () => {
  let controller: QoutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QoutesController],
    }).compile();

    controller = module.get<QoutesController>(QoutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

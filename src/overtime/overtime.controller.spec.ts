import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeController } from './overtime.controller';
import { OvertimeService } from './overtime.service';

describe('OvertimeController', () => {
  let controller: OvertimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeController],
      providers: [OvertimeService],
    }).compile();

    controller = module.get<OvertimeController>(OvertimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

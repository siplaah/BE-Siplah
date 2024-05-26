import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultController } from './key_result.controller';
import { KeyResultService } from './key_result.service';

describe('KeyResultController', () => {
  let controller: KeyResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultController],
      providers: [KeyResultService],
    }).compile();

    controller = module.get<KeyResultController>(KeyResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

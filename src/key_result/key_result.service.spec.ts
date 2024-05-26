import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultService } from './key_result.service';

describe('KeyResultService', () => {
  let service: KeyResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyResultService],
    }).compile();

    service = module.get<KeyResultService>(KeyResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

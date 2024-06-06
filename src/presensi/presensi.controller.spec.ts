import { Test, TestingModule } from '@nestjs/testing';
import { PresensiController } from './presensi.controller';
import { PresensiService } from './presensi.service';

describe('PresensiController', () => {
  let controller: PresensiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresensiController],
      providers: [PresensiService],
    }).compile();

    controller = module.get<PresensiController>(PresensiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

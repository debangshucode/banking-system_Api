import { Test, TestingModule } from '@nestjs/testing';
import { FixedDepositController } from './fixed-deposit.controller';
import { FixedDepositService } from './fixed-deposit.service';

describe('FixedDepositController', () => {
  let controller: FixedDepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FixedDepositController],
      providers: [FixedDepositService],
    }).compile();

    controller = module.get<FixedDepositController>(FixedDepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

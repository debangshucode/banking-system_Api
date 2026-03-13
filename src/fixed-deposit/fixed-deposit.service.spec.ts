import { Test, TestingModule } from '@nestjs/testing';
import { FixedDepositService } from './fixed-deposit.service';

describe('FixedDepositService', () => {
  let service: FixedDepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FixedDepositService],
    }).compile();

    service = module.get<FixedDepositService>(FixedDepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

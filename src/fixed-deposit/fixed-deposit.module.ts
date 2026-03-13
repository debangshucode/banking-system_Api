import { Module } from '@nestjs/common';
import { FixedDepositService } from './fixed-deposit.service';
import { FixedDepositController } from './fixed-deposit.controller';

@Module({
  controllers: [FixedDepositController],
  providers: [FixedDepositService],
})
export class FixedDepositModule {}

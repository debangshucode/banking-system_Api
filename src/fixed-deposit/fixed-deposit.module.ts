import { Module } from '@nestjs/common';
import { FixedDepositService } from './fixed-deposit.service';
import { FixedDepositController } from './fixed-deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedDeposit } from './entities/fixed-deposit.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FixedDeposit])],
  controllers: [FixedDepositController],
  providers: [FixedDepositService],
})
export class FixedDepositModule {}

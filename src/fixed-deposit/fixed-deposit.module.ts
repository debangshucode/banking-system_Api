import { Module } from '@nestjs/common';
import { FixedDepositService } from './fixed-deposit.service';
import { FixedDepositController } from './fixed-deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedDeposit } from './entities/fixed-deposit.entity';
import { Account } from 'src/account/entities/account.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FixedDeposit,Account])],
  controllers: [FixedDepositController],
  providers: [FixedDepositService],
})
export class FixedDepositModule {}

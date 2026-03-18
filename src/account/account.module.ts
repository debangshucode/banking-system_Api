import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { CardModule } from 'src/card/card.module';
import { FixedDeposit } from 'src/fixed-deposit/entities/fixed-deposit.entity';
import { FixedDepositModule } from 'src/fixed-deposit/fixed-deposit.module';

@Module({
  imports:[TypeOrmModule.forFeature([Account,User]),CardModule,FixedDepositModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports :[AccountService]
})
export class AccountModule {}

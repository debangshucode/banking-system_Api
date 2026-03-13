import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransferModule } from './transfer/transfer.module';
import { CardModule } from './card/card.module';
import { FixedDepositModule } from './fixed-deposit/fixed-deposit.module';

@Module({
  imports: [UsersModule, AccountModule, TransactionModule, TransferModule, CardModule, FixedDepositModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from 'src/account/entities/account.entity';
import { Transfer } from 'src/transfer/entities/transfer.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Transaction,Account,Transfer])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}

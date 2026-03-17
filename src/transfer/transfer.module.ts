import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { Transfer } from './entities/transfer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Account } from 'src/account/entities/account.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Transfer,Transaction,Account])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}

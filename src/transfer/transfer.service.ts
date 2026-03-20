import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { User } from 'src/users/entities/user.entity';
import { Account, AccountStatus } from 'src/account/entities/account.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Transfer, TransferStatus } from './entities/transfer.entity';
import { Transaction, TransactionStatus, TransactionType } from 'src/transaction/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class TransferService {

  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>, @InjectRepository(Transfer) private transferRepo: Repository<Transfer>, @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>, private dataSource: DataSource) { }

  private async createTransferTransactions(
    manager: EntityManager,
    savedTransfer: Transfer,
    fromAccount: Account,
    toAccount: Account,
    amount: number
  ) {
    const senderTransaction = manager.create(Transaction, {
      account: fromAccount,
      amount,
      transactionType: TransactionType.WITHDRAWAL,
      transfer: savedTransfer,
      status: TransactionStatus.SUCCESS,
    });

    const receiverTransaction = manager.create(Transaction, {
      account: toAccount,
      amount,
      transactionType: TransactionType.DEPOSIT,
      transfer: savedTransfer,
      status: TransactionStatus.SUCCESS,
    });

    await manager.save([senderTransaction, receiverTransaction]);

  }
  async create(user: User, createTransferDto: CreateTransferDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const account = await queryRunner.manager.findOne(Account, { where: { id: createTransferDto.fromAccountId }, relations: { user: true },lock: { mode: 'pessimistic_write' } });
      if (!account) throw new NotFoundException('Source Account not found');
      if (account.user.id !== user.id) throw new ForbiddenException(`You don't have access to this account`)

      const toAccount = await queryRunner.manager.findOne(Account, { where: { id: createTransferDto.toAccountId }, relations: { user: true },lock: { mode: 'pessimistic_write' } });
      if (!toAccount) throw new NotFoundException('Destination Account not Found');

      if (account.id === toAccount.id) throw new BadRequestException('Source And Destination Accounts can not be same');

      if (account.status === AccountStatus.CLOSED || account.status === AccountStatus.PAUSED) throw new BadRequestException(`Your account is ${account.status}`);
      if (toAccount.status === AccountStatus.CLOSED || toAccount.status === AccountStatus.PAUSED) throw new BadRequestException(`Receiveraccount is ${toAccount.status}`);

      let senderBalance = Number(account.balance)
      let receiverBalance= Number(toAccount.balance);

      if (senderBalance < createTransferDto.amount) throw new BadRequestException('InsufficientAccount Balance')

      const transfer = queryRunner.manager.create(Transfer, {
        amount: createTransferDto.amount,
        fromAccount: account,
        toAccount: toAccount,
        status: TransferStatus.SUCCESS,
      });

      senderBalance -= createTransferDto.amount;
      receiverBalance+= createTransferDto.amount;

      account.balance = senderBalance;
      toAccount.balance = receiverBalance;

      await queryRunner.manager.save(account);
      await queryRunner.manager.save(toAccount);

      const savedTransfer = await queryRunner.manager.save(transfer)
      await this.createTransferTransactions(queryRunner.manager, savedTransfer, account, toAccount, createTransferDto.amount)
      await queryRunner.commitTransaction()
      return savedTransfer;
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
    finally {
      await queryRunner.release()
    }
  }


  findAll(query:PaginateQuery) {
    return paginate(query,this.transferRepo,{
      relations:['fromAccount','toAccount'],
      sortableColumns:['id','amount','createdAt'],
      defaultSortBy:[['id','DESC']]
    })
  }

  async findOne(id: number) {
    const transfer = await this.transferRepo.findOne({where:{id},relations:{fromAccount:true,toAccount:true}})
    if(!transfer) throw new NotFoundException('This transfer does not exisit');
    return transfer;
  }

  // update(id: number, updateTransferDto: UpdateTransferDto) {
  //   return `This action updates a #${id} transfer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} transfer`;
  // }
}

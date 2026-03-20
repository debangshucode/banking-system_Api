import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { Account, AccountStatus } from 'src/account/entities/account.entity';
import { Repository,DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionStatus, TransactionType } from './entities/transaction.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class TransactionService {

  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>, @InjectRepository(Transaction) private TransactionRepo: Repository<Transaction>, private dataSource: DataSource) { }


  // * --Create transaction
  async create(user: User, createTransactionDto: CreateTransactionDto) {

    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction()

    try {

      const targetAccount = createTransactionDto.accountId;
      const account = await queryRunner.manager.findOne(Account, { where: { id: targetAccount }, relations: { user: true } })
      if (!account) throw new NotFoundException('Account Not Found');
      if (account.user.id !== user.id) throw new ForbiddenException (`You don't have permission to access this account`);
      if (account.status === AccountStatus.CLOSED || account.status === AccountStatus.PAUSED) throw new BadRequestException(`Can not initiate transaction as this Account is ${account.status}`)

      const transaction = queryRunner.manager.create(Transaction, {
        transactionType : createTransactionDto.transactionType,
        amount : createTransactionDto.amount,
        account : account,
      });

      let currentBalance = Number(account.balance)

      if (transaction.transactionType === TransactionType.DEPOSIT) {
        currentBalance += transaction.amount
      }
      if (transaction.transactionType === TransactionType.WITHDRAWAL) {
        if (currentBalance < transaction.amount) {
          throw new BadRequestException('Insufficient Balance');
        }

        currentBalance -= transaction.amount;
      }

      account.balance = currentBalance;
      transaction.status = TransactionStatus.SUCCESS;
      await queryRunner.manager.save(account);
      const savedTransaction =await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction()

      return savedTransaction;
    }
    catch(err){
      await queryRunner.rollbackTransaction();
      throw err;
    }
    finally{
      await queryRunner.release()
    }

  }

  // todo -- Get all Transaction
  findAll(query: PaginateQuery) {
    return paginate(query, this.TransactionRepo, {
      relations: ['account'],
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']]
    })
  }

  // todo -- Get one  Transaction
  async findOne(id: number) {
    const transaction = await this.TransactionRepo.findOne({ where: { id }, relations: { account: true } })
    if (!transaction) throw new NotFoundException('InValid Request No matching transaction found')
    return transaction;
  }

  // ! -- Update Transaction
  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  // ! -- Deactivate Transaction 
  // remove(id: number) {
  //   return `This action removes a #${id} transaction`;
  // }
}

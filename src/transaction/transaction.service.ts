import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { Account, AccountStatus } from 'src/account/entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionStatus, TransactionType } from './entities/transaction.entity';

@Injectable()
export class TransactionService {

  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>, @InjectRepository(Transaction) private TransactionRepo: Repository<Transaction>) { }


  // * --Create transaction
  async create(user: User, createTransactionDto: CreateTransactionDto) {
    const targetAccount = createTransactionDto.accountId;
    const account = await this.accountRepo.findOne({ where: { id: targetAccount }, relations: { user: true } })
    if (!account) throw new NotFoundException('Account Not Found');
    if (account.user.id !== user.id) throw new BadRequestException('You dont have permision of this Account');
    if (account.status === AccountStatus.CLOSED || account.status === AccountStatus.PAUSED) throw new BadRequestException(`Can not initiate transaction as this Account is ${account.status}`)

    const transaction = this.TransactionRepo.create();
    transaction.transactionType = createTransactionDto.transactionType;
    transaction.amount = createTransactionDto.amount;
    transaction.account = account;

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
    await this.accountRepo.save(account);
    return this.TransactionRepo.save(transaction);

  }

  // todo -- Get all Transaction
  findAll() {
    return `This action returns all transaction`;
  }

  // todo -- Get one  Transaction
  async findOne(id: number) {
    const transaction = await this.TransactionRepo.findOne({where:{id},relations:{account:true}})
    if(!transaction) throw new NotFoundException('InValid Request No matching transaction found')
    return transaction; 
  }

  // todo -- Update Transaction
  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  // todo -- Deactivate Transaction
  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

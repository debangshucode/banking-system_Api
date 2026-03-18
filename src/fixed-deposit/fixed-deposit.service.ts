import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFixedDepositDto } from './dto/create-fixed-deposit.dto';
import { UpdateFixedDepositDto } from './dto/update-fixed-deposit.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FdStatus, FixedDeposit } from './entities/fixed-deposit.entity';
import { Repository, DataSource } from 'typeorm';
import { Account, AccountStatus } from 'src/account/entities/account.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Transaction, TransactionStatus, TransactionType } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class FixedDepositService {

  constructor(
    @InjectRepository(FixedDeposit) private fdRepo: Repository<FixedDeposit>,
    private dataSource: DataSource
  ) { }

  async create(user: User, createFixedDepositDto: CreateFixedDepositDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const account = await queryRunner.manager.findOne(Account, { where: { id: createFixedDepositDto.accountId }, relations: { user: true } })

      if (!account) throw new NotFoundException('Account does not exist ')
      if (account.user.id !== user.id) throw new BadRequestException(' You are not authorized to access this account');

      let balance = Number(account?.balance)
      if (balance < createFixedDepositDto.principalAmount) throw new BadRequestException('Insufficient Account Balance');
      if (account.status === AccountStatus.CLOSED || account.status === AccountStatus.PAUSED) throw new BadRequestException(`This Account is ${account.status}`);

      const maturityDate = new Date()
      maturityDate.setFullYear(maturityDate.getFullYear() + createFixedDepositDto.tenure)
      const fixedDeposit= queryRunner.manager.create(FixedDeposit, {
        account: account,
        principalAmount: createFixedDepositDto.principalAmount,
        tenure: createFixedDepositDto.tenure,
        interestRate: 9,
        maturityDate: maturityDate,
      });
      balance -= createFixedDepositDto.principalAmount;
      account.balance = balance;

      const transaction = queryRunner.manager.create(Transaction, {
        account: account,
        amount:createFixedDepositDto.principalAmount,
        transactionType: TransactionType.WITHDRAWAL,
        status: TransactionStatus.SUCCESS,
      })

      await queryRunner.manager.save(account);
      await queryRunner.manager.save(transaction)
      const savedFd = await queryRunner.manager.save(fixedDeposit);
      await queryRunner.commitTransaction()

      return savedFd;
    }
    catch (err) {
      await queryRunner.rollbackTransaction()
      throw err;
    }
    finally {
      await queryRunner.release()
    }
  }

  async findAll(query: PaginateQuery) {
    return paginate(query, this.fdRepo, {
      relations: ['account'],
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']]
    });
  }

  async findOne(id: number) {
    const fd = await this.fdRepo.findOne({ where: { id }, relations: { account: true } });
    if (!fd) throw new NotFoundException('No fixed deposit found');
    return fd;
  }

//   update(id: number, updateFixedDepositDto: UpdateFixedDepositDto) {
//     return `This action updates a #${id} fixedDeposit`;
//   }

  async remove(id: number) {
    const fd = await this.fdRepo.findOne({where:{id},relations:{account:true}});
    
    if(!fd) throw new NotFoundException('Fd not Found')
    if(fd.status === FdStatus.CLOSED) throw new BadRequestException(`This FD is ${fd.status}`);
    fd.status = FdStatus.CLOSED;
    return await this.fdRepo.save(fd);
  }
}

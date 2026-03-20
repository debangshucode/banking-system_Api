import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountStatus, AccountType } from './entities/account.entity';
import { In, Not, Repository,QueryRunner } from 'typeorm';
import { User, UserRole, UserStatus } from 'src/users/entities/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { FixedDepositService } from 'src/fixed-deposit/fixed-deposit.service';
import { CardService } from 'src/card/card.service';
import { Card, CardStatus } from 'src/card/entities/card.entity';
import { FdStatus, FixedDeposit } from 'src/fixed-deposit/entities/fixed-deposit.entity';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>, @InjectRepository(User) private userReop: Repository<User>, private fdService: FixedDepositService, private cardService: CardService) { }

  // ** generate account number helper function
  private async generateAccountNumber() {
    const accounts = await this.accountRepo.find({
      order: { accountNumber: 'DESC' },
      take: 1
    });
    let nextNumber = 1;
    if (accounts.length > 0 && accounts[0].accountNumber) {
      nextNumber = parseInt(accounts[0].accountNumber, 10) + 1;
    }
    return nextNumber.toString().padStart(10, '0');
  }

  // * --create account service
  async create(user: User, type: AccountType, userId: number) {
    const createUser = await this.userReop.findOne({ where: { id: userId } })
    if (!createUser) throw new NotFoundException('user not found');

    if (user.role !== UserRole.ADMIN && user.id !== createUser.id) throw new ForbiddenException(`You don't have access to create account for another user`)
    if (createUser.status === UserStatus.INACTIVE) throw new BadRequestException('User is InActive');

    const accountNumber = await this.generateAccountNumber()

    const account = this.accountRepo.create();
    account.accountType = type;
    account.user = createUser;
    account.accountNumber = accountNumber;
    return this.accountRepo.save(account);
  }

  // * --find All account service
  findAll(query: PaginateQuery) {
    return paginate(query, this.accountRepo, {
      relations: ['user'],
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']]
    })
  }

  // * --find one account service
  async findOne(id: number) {
    const account = await this.accountRepo.findOne({
      where: { id },
      relations: { user: true },
    })
    if (!account) throw new NotFoundException('Account not found')
    return account;
  }

  // * --update account service
  async update(currentUser: User, id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepo.findOne({ where: { id }, relations: { user: true } });
    if (!account) throw new NotFoundException('Account not found');
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== account.user.id) throw new ForbiddenException(`You don't have permission to update this account`)
    Object.assign(account, updateAccountDto);
    return this.accountRepo.save(account)
  }

  // * --deactivate account service
  async close(id: number) {
    const account = await this.accountRepo.findOne({ where: { id }, relations: { user: true } });
    if (!account) throw new NotFoundException('Account not found')
    if (account.status === AccountStatus.CLOSED) throw new BadRequestException('Account is Already closed')
    account.status = AccountStatus.CLOSED;
    return this.accountRepo.save(account);
  }

  // ! -- close all accouts of a user - user service 

  async closeByUser(userId: number, queryRunner: QueryRunner) {
    const accounts = await queryRunner.manager.find(Account, {
      where: { user: { id: userId } },
      select: ['id'],
    });
    const accountIds = accounts.map((account) => account.id);

    if (accountIds.length > 0) {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Card)
        .set({ status: CardStatus.BLOCKED })
        .where('"accountId" IN (:...accountIds)', { accountIds })
        .andWhere('status != :blockedStatus', { blockedStatus: CardStatus.BLOCKED })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .update(FixedDeposit)
        .set({ status: FdStatus.CLOSED })
        .where('"accountId" IN (:...accountIds)', { accountIds })
        .andWhere('status != :closedStatus', { closedStatus: FdStatus.CLOSED })
        .execute();
    }

    const result = await queryRunner.manager.update(
      Account, {
      user: { id: userId },
      status: Not(AccountStatus.CLOSED)
    },
      {
        status: AccountStatus.CLOSED
      }
    )

    return result.affected;

  }

}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountStatus, AccountType } from './entities/account.entity';
import { Repository } from 'typeorm';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>, @InjectRepository(User) private userReop: Repository<User>) { }

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
  async create(type: AccountType, userId: number) {
    const user = await this.userReop.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('user not found');
    if (user.status === UserStatus.INACTIVE) throw new BadRequestException('User is InActive');

    const accountNumber = await this.generateAccountNumber()

    const account = this.accountRepo.create();
    account.accountType = type;
    account.user = user;
    account.accountNumber = accountNumber;
    return this.accountRepo.save(account);
  }

  // * --find All account service
  findAll(query:PaginateQuery) {
    return paginate (query,this.accountRepo,{
      relations:['user'],
      sortableColumns:['id'],
      defaultSortBy:[['id','DESC']]
    })
  }

  // * --find one account service
  async findOne(id: number) {
    const account = await this.accountRepo.findOne({
      where: { id },
      relations: { user: true },
    })
    if(!account) throw new NotFoundException('Account not found')
    return account;
  }

  // * --update account service
  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountRepo.findOne({where:{id},relations:{user:true}});
    if(!account) throw new NotFoundException('Account not found');
    
    Object.assign(account,updateAccountDto);
    return this.accountRepo.save(account)
  }

  // * --deactivate account service
  async close(id: number) {
    const account = await this.accountRepo.findOne({where:{id},relations:{user:true}});
    if(!account) throw new NotFoundException('Account not found')
    if(account.status === AccountStatus.CLOSED) throw new BadRequestException('Account is Already closed')
    account.status = AccountStatus.CLOSED;
    return this.accountRepo.save(account);
  }
}

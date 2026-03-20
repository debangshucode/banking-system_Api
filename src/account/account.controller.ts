import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { AccountDto } from './dto/account.dto';
import { Paginate } from 'nestjs-paginate';
import type {PaginateQuery} from 'nestjs-paginate'
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';


@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // * --create account 
  @Post()
  @Serialize(AccountDto)
  @UseGuards(AuthGuard)
  create(@CurrentUser() user:User,@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(user,createAccountDto.accountType,createAccountDto.userId);
  }

  //* --get all account
  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async findAll(@Paginate() query:PaginateQuery) {
    const accounts= await this.accountService.findAll(query);
    return {
      ...accounts,
      data:plainToInstance(AccountDto,accounts.data,{
        excludeExtraneousValues:true,
      })
    }
  }

  //* --get one account
  @Get(':id')
  @UseGuards(AuthGuard)
  @Serialize(AccountDto)
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  //* --update account
  @Patch(':id')
  @UseGuards( AuthGuard)
  @Serialize(AccountDto)
  update(@CurrentUser() user:User,@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(user,+id, updateAccountDto);
  }

  //* --deactivate account
  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  @Serialize(AccountDto)
  remove(@Param('id') id: string) {
    return this.accountService.close(+id);
  }
}

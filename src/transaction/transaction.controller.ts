import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { TransactionDto } from './dto/transaction.dto';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate'
import { plainToInstance } from 'class-transformer';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // * Create Transaction
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(TransactionDto)
  create(@CurrentUser() user:User,  @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(user,createTransactionDto);
  }

  // * --Get All Transaction paginated
  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async findAll(@Paginate() query:PaginateQuery) {
    const result =  await this.transactionService.findAll(query);
    return {
      ...result,
      data:plainToInstance(TransactionDto,result.data,{
        excludeExtraneousValues:true,
      })
    }
  }

  // * --Get one Transaction 
  @Get(':id')
  @UseGuards(AuthGuard)
  @Serialize(TransactionDto)
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  // ! --Update One Transaction (should not able to update transaction)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionService.update(+id, updateTransactionDto);
  // }

  // ! --Delete One Transaction (no delete transaction)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
}

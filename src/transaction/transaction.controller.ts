import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { TransactionDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // * Create Transaction
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(TransactionDto)
  create(@CurrentUser() user:User,  @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(user,createTransactionDto);
  }

  // todo --Get All Transaction paginated
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  // * --Get one Transaction 
  @Get(':id')
  @UseGuards(AuthGuard)
  @Serialize(TransactionDto)
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  // todo --Update One Transaction 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  // todo --Delete One Transaction 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}

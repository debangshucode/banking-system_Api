import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { TransferDto } from './dto/transfer.dto';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate'
import { plainToInstance } from 'class-transformer';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(TransferDto)
  create(@CurrentUser() user:User,@Body() createTransferDto: CreateTransferDto) {
    return this.transferService.create(user,createTransferDto);
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async findAll(@Paginate() query:PaginateQuery) {
    const result = await this.transferService.findAll(query);

    return{
      ...result,
      data:plainToInstance(TransferDto,result.data,{
        excludeExtraneousValues:true,
      })
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Serialize(TransferDto)
  findOne(@Param('id') id: string) {
    return this.transferService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransferDto: UpdateTransferDto) {
  //   return this.transferService.update(+id, updateTransferDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transferService.remove(+id);
  // }
}

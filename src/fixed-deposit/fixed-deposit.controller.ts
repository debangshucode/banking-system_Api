import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FixedDepositService } from './fixed-deposit.service';
import { CreateFixedDepositDto } from './dto/create-fixed-deposit.dto';
import { UpdateFixedDepositDto } from './dto/update-fixed-deposit.dto';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Paginate } from 'nestjs-paginate';
import type {PaginateQuery } from 'nestjs-paginate'
import { plainToInstance } from 'class-transformer';
import { FixedDepositDto } from './dto/fixed-deposit.dto';
@Controller('fixed-deposit')
export class FixedDepositController {
  constructor(private readonly fixedDepositService: FixedDepositService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(FixedDepositDto)
  create(@CurrentUser() user:User,@Body() createFixedDepositDto: CreateFixedDepositDto) {
    return this.fixedDepositService.create(user,createFixedDepositDto);
  }

  @Get()
  async findAll(@Paginate() query:PaginateQuery) {
    const result = await this.fixedDepositService.findAll(query);
    return{
      ...result,
      data:plainToInstance(FixedDepositDto,result.data,{
        excludeExtraneousValues:true
      })
    }
  }

  @Get(':id')
  @Serialize(FixedDepositDto)
  findOne(@Param('id') id: string) {
    return this.fixedDepositService.findOne(+id);
  }

  @Patch(':id')
  @Serialize(FixedDepositDto)
  update(@Param('id') id: string, @Body() updateFixedDepositDto: UpdateFixedDepositDto) {
    return this.fixedDepositService.update(+id, updateFixedDepositDto);
  }

  @Delete(':id')
  @Serialize(FixedDepositDto)
  remove(@Param('id') id: string) {
    return this.fixedDepositService.remove(+id);
  }
}

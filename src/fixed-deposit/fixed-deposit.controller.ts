import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FixedDepositService } from './fixed-deposit.service';
import { CreateFixedDepositDto } from './dto/create-fixed-deposit.dto';
import { UpdateFixedDepositDto } from './dto/update-fixed-deposit.dto';

@Controller('fixed-deposit')
export class FixedDepositController {
  constructor(private readonly fixedDepositService: FixedDepositService) {}

  @Post()
  create(@Body() createFixedDepositDto: CreateFixedDepositDto) {
    return this.fixedDepositService.create(createFixedDepositDto);
  }

  @Get()
  findAll() {
    return this.fixedDepositService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fixedDepositService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFixedDepositDto: UpdateFixedDepositDto) {
    return this.fixedDepositService.update(+id, updateFixedDepositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fixedDepositService.remove(+id);
  }
}

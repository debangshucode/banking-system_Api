import { Injectable } from '@nestjs/common';
import { CreateFixedDepositDto } from './dto/create-fixed-deposit.dto';
import { UpdateFixedDepositDto } from './dto/update-fixed-deposit.dto';

@Injectable()
export class FixedDepositService {
  create(createFixedDepositDto: CreateFixedDepositDto) {
    return 'This action adds a new fixedDeposit';
  }

  findAll() {
    return `This action returns all fixedDeposit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fixedDeposit`;
  }

  update(id: number, updateFixedDepositDto: UpdateFixedDepositDto) {
    return `This action updates a #${id} fixedDeposit`;
  }

  remove(id: number) {
    return `This action removes a #${id} fixedDeposit`;
  }
}

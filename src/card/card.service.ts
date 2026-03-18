import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, AccountStatus } from 'src/account/entities/account.entity';
import { Card, CardStatus } from './entities/card.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt, randomInt } from 'crypto';
import { paginate, PaginateQuery } from 'nestjs-paginate';

const scrypt = promisify(_scrypt)
@Injectable()
export class CardService {

  constructor(@InjectRepository(Account) private accountRepo: Repository<Account>, @InjectRepository(Card) private cardRepo: Repository<Card>) { }

  private async generateCardNumber() {
    const accounts = await this.cardRepo.find({
      order: { cardNumber: 'DESC' },
      take: 1
    });
    let nextNumber = 1;
    if (accounts.length > 0 && accounts[0].cardNumber) {
      nextNumber = parseInt(accounts[0].cardNumber, 10) + 1;
    }
    return nextNumber.toString().padStart(10, '0');
  }
  private async hashPassword(password: string) {
    const salt = randomBytes(6).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    return `${salt}.${hash.toString('hex')}`;
  }
  private async verifyPassword(enteredPassword: string, storedPassword) {
    const [salt, storedHash] = storedPassword.split('.');

    const hash = await scrypt(enteredPassword, salt, 32) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong Password');
    }
  }

  async create(user: User, createCardDto: CreateCardDto) {
    const account = await this.accountRepo.findOne({ where: { id: createCardDto.accountId }, relations: { user: true } })
    if (!account) throw new NotFoundException('Account does not exist');
    if (account.user.id !== user.id) throw new BadRequestException('You are not authorized to access this account');
    if (account.status === AccountStatus.CLOSED || account.status === AccountStatus.PAUSED) throw new BadRequestException(`This account is ${account.status}`);

    const card = this.cardRepo.create();
    card.account = account;
    card.cardType = createCardDto.cardType;
    if (createCardDto.pin) {
      const pin = await this.hashPassword(createCardDto.pin)
      card.pin = pin;
    }
    card.cardNumber = await this.generateCardNumber()
    // const cvv = await this.hashPassword(randomInt(100, 1000).toString());
    card.cvv = randomInt(100, 1000).toString();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10);

    card.expiryDate = expiryDate;

    return this.cardRepo.save(card)
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.cardRepo, {
      relations: ['account'],
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']]
    })
  }

  async findOne(id: number) {
    const card = await this.cardRepo.findOne({ where: { id }, relations: { account: true } });
    if (!card) throw new NotFoundException('Card does not exist');
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    const card = await this.cardRepo.findOne({ where: { id }, relations: { account: true } })
    if (!card) throw new NotFoundException('Card does not exists');

    card.status = updateCardDto?.status ?? card.status;

    if (updateCardDto.currentPin && !updateCardDto.newPin) throw new BadRequestException('Both current PIN and new PIN are required ')
    if (updateCardDto.newPin && !updateCardDto.currentPin) throw new BadRequestException('Both current PIN and new PIN are required ')

    if (updateCardDto.currentPin && updateCardDto.newPin) {
      await this.verifyPassword(updateCardDto.currentPin, card.pin);
      const newPin = await this.hashPassword(updateCardDto.newPin);
      card.pin = newPin;
    }

    return await this.cardRepo.save(card)

  }

  async remove(id: number) {
    const card = await this.cardRepo.findOne({ where: { id }, relations: { account: true } })
    if (!card) throw new NotFoundException('Card does not exists');
    if (card.status === CardStatus.BLOCKED || card.status === CardStatus.EXPIRED) throw new BadRequestException(`Card is ${card.status}`);
    card.status = CardStatus.BLOCKED;
    return await this.cardRepo.save(card)
  }
}

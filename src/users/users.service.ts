import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';


const scrypt = promisify(_scrypt)

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>){}

  //*create user
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.repo.findOne({
      where:{
        email:createUserDto.email
      }
    })
    if(existingUser) throw new BadRequestException('User with this mail is already registerd ! Try to Sign in')

      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(createUserDto.password,salt,32)) as Buffer

      const result = salt+'.'+hash.toString('hex');
      
      const user = this.repo.create({
        ...createUserDto,
        password:result,
      })

      return this.repo.save(user);

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    const user = this.repo.findOne({where:{id}})
    if(!user) throw new NotFoundException('user not found');

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

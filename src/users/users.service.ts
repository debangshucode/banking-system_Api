import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { paginate, PaginateQuery } from 'nestjs-paginate';


const scrypt = promisify(_scrypt)

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  //* --create user
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.repo.findOne({
      where: {
        email: createUserDto.email
      }
    })
    if (existingUser) throw new BadRequestException('User with this mail is already registerd ! Try to Sign in')

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer

    const result = salt + '.' + hash.toString('hex');

    const user = this.repo.create({
      ...createUserDto,
      password: result,
    })

    return this.repo.save(user);

  }

  // * --SignIn
  async signIn(email: string, password: string) {
    const user = await this.repo.findOne({
      where: {
        email
      }
    })

    if (!user) throw new NotFoundException('user not found ')
    
    const [salt,storedPass] = user.password.split('.');
    const hash = (await scrypt(password,salt,32)) as Buffer;

    if(storedPass !== hash.toString('hex')){
      throw new BadRequestException('Wrong Password, Please enter correct Password');
    }

    return user;
  }
  // todo --find all users 
  findAll(query:PaginateQuery) {
    return paginate(query,this.repo,{
      sortableColumns:['id'],
      defaultLimit:10,
    })
  }

  // * --Get user by its id
  findOne(id: number) {
    const user = this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  // * --update users
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOne({where:{id}})
    if(!user) throw new NotFoundException("User not found")
    
    Object.assign(user,updateUserDto)
    return this.repo.save(user)
  }

  // todo -- remove users 
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

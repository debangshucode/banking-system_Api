import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { paginate, PaginateQuery } from 'nestjs-paginate';


const scrypt = promisify(_scrypt)

async function verifyPassword(enteredPassword:string, storedPassword) {
  const [salt, storedHash] = storedPassword.split('.');

  const hash = await scrypt(enteredPassword, salt, 32) as Buffer;

  if (storedHash !== hash.toString('hex')) {
    throw new BadRequestException('Wrong Password');
  }
}
async function hashPassword(password: string) {
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrypt(password, salt, 32)) as Buffer;

  return `${salt}.${hash.toString('hex')}`;
}

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

   

    const result = await hashPassword(createUserDto.password)
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
    if(user.status === UserStatus.INACTIVE) throw new BadRequestException('User is Deactivated')

    await verifyPassword(password,user.password)

    return user;
  }
  // * --find all users 
  findAll(query: PaginateQuery) {
    return paginate(query, this.repo, {
      sortableColumns: ['id'],
      defaultLimit: 10,
    })
  }

  // * --Get user by its id
  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  // * --update users
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException("User not found")

    Object.assign(user, updateUserDto)
    return this.repo.save(user)
  }

  // * --changePass
  async changePass(user: User, currentPassword: string, newPassword: string) {
    if(user.status === UserStatus.INACTIVE) throw new BadRequestException('User Is Deactivated')
    await verifyPassword(currentPassword,user.password);
    user.password = await hashPassword(newPassword)

    return this.repo.save(user)
  }

  // * -- remove users 
  async deactivate(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');
    user.status = UserStatus.INACTIVE;
    return this.repo.save(user)
  }
}

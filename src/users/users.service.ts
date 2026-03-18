import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { Repository,DataSource } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { AccountService } from 'src/account/account.service';


const scrypt = promisify(_scrypt)

async function verifyPassword(enteredPassword: string, storedPassword) {
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

  constructor(@InjectRepository(User) private repo: Repository<User>, private accountService: AccountService, private dataSource: DataSource) { }

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
    if (user.status === UserStatus.INACTIVE) throw new BadRequestException('User is Deactivated')

    await verifyPassword(password, user.password)

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
  async update(user: User, id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.repo.findOne({ where: { id } })
    if (!updateUser) throw new NotFoundException("User not found")
    if (user.role !== UserRole.ADMIN && user.id !== updateUser.id) throw new BadRequestException(`You don't have the permission to update this user`)
    Object.assign(updateUser, updateUserDto)
    return this.repo.save(updateUser)
  }

  // * --changePass
  async changePass(user: User, currentPassword: string, newPassword: string) {
    if (user.status === UserStatus.INACTIVE) throw new BadRequestException('User Is Deactivated')
    await verifyPassword(currentPassword, user.password);
    user.password = await hashPassword(newPassword)

    return this.repo.save(user)
  }

  // * -- remove users 
  async deactivate(id: number) {


    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id },
      });

      if (!user) throw new NotFoundException(`User not found`);

      user.status = UserStatus.INACTIVE;
      await queryRunner.manager.save(user);

      await this.accountService.closeByUser(user.id, queryRunner);

      await queryRunner.commitTransaction()
      return user;
    }
    catch (err) {
      await queryRunner.rollbackTransaction()
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }
}

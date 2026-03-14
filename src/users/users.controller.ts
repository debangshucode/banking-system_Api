import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Session, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptor/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // *currentUser
  @Get('/curUser')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  async getCurUSer(@CurrentUser() user: User) {
    return user
  }

  // * create user/signup
  @Post('/signup')
  @Serialize(UserDto)
  async create(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.usersService.create(createUserDto);
    session.userId = user.id;
    return user;
  }

  // * signin
  @Post('/signin')
  @Serialize(UserDto)
  async signIn(@Body() createUserDto: CreateUserDto, @Session() session: any) {
    const user = await this.usersService.signIn(createUserDto.email, createUserDto.password)
    session.userId = user.id;
    return user;
  }

  // * signOut
  @Post('/signout')
  @HttpCode(200)
  async signout(@Session() session: any) {
    session.userId = null;
  }

  // * --find All users
  @Get('/all-users')
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.usersService.findAll(query);

    return {
      ...result,
      data:plainToInstance(UserDto,result.data,{
        excludeExtraneousValues:true
      })
    }
  }

  // * get user by id
  @Get(':id')
  @Serialize(UserDto)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // *  -- Update User
  @Patch(':id')
  @Serialize(UserDto)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }


  // * -- Remove Users
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

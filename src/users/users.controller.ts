import { Controller, Get, Post, Body, Patch, Param, Delete, Session, HttpCode, UseGuards } from '@nestjs/common';
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
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { AdminGuard } from 'src/guards/admin.guard';


@ApiTags('Users')
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
  async signIn(@Body() createUserDto: SignInDto, @Session() session: any) {
    const user = await this.usersService.signIn(createUserDto.email!, createUserDto.password!)
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
  @UseGuards(AuthGuard,AdminGuard)
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.usersService.findAll(query);

    return {
      ...result,
      data: plainToInstance(UserDto, result.data, {
        excludeExtraneousValues: true
      })
    }
  }

  // * get user by id
  @Get(':id')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // * -- Update/Change Password
  @Patch('/change-password')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  changePass(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePass(user, dto.currentPassword, dto.newPassword);
  }


  // *  -- Update User
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  update(@CurrentUser() user:User,@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user,+id, updateUserDto);
  }


  // * -- Remove Users
  @Delete(':id')
  @UseGuards(AuthGuard,AdminGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.usersService.deactivate(+id);
  }
}

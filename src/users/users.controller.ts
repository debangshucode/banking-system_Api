import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Session, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptor/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // *currentUser
  @Get('/curUser')
  @Serialize(UserDto)
  async getCurUSer(@CurrentUser() user:User){
    return user
  }
  
  // * create user/signup
  @Post()
  @Serialize(UserDto)
  async create(@Body() createUserDto: CreateUserDto, @Session() session:any) {
    const user = await this.usersService.create(createUserDto);
    session.userId = user.id;
    return user;
  }

  // * signin
  @Post('/signin')
  @Serialize(UserDto)
  async signIn(@Body() createUserDto:CreateUserDto, @Session() session:any) {
    const user = await this.usersService.signIn(createUserDto.email,createUserDto.password)
    session.userId = user.id;
    return user;
  }

  // * signOut
  @Post('/signout')
  @HttpCode(200)
  async signout(@Session() session:any){
    session.userId = null;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Serialize(UserDto)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

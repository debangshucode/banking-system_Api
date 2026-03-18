import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccountService } from 'src/account/account.service';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),AccountModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}

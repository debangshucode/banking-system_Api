import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransferModule } from './transfer/transfer.module';
import { CardModule } from './card/card.module';
import { FixedDepositModule } from './fixed-deposit/fixed-deposit.module';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun:true,
      ssl:{
        rejectUnauthorized:false,
      }
    })
  }), UsersModule, AccountModule, TransactionModule, TransferModule, CardModule, FixedDepositModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

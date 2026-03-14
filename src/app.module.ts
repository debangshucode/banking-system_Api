import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransferModule } from './transfer/transfer.module';
import { CardModule } from './card/card.module';
import { FixedDepositModule } from './fixed-deposit/fixed-deposit.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';
import { CurrentUserMiddleware } from './users/middleware/current-user.middleware';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })
    , TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    UsersModule, AccountModule, TransactionModule, TransferModule, CardModule, FixedDepositModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  constructor(private configService:ConfigService){}
  configure(consumer: MiddlewareConsumer){
    consumer.apply(
      cookieSession({
        keys:[this.configService.get('COOKIE_KEY')!]
      }),
      CurrentUserMiddleware
    ).forRoutes('*')
  }
  

}

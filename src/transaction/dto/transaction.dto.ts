import { Expose, Transform } from "class-transformer";
import { TransactionStatus, TransactionType } from "../entities/transaction.entity";

export class TransactionDto {
    @Expose()
    id:number;

    @Expose()
    transactionType:TransactionType;

    @Expose()
    amount:number;
    
    @Expose()
    status:TransactionStatus;

    @Expose()
    createdAt:Date;

    @Expose()
    @Transform(({obj})=>obj.account?.id)
    accountId: number;
}
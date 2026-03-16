import { Expose, Transform } from "class-transformer";
import { AccountStatus, AccountType } from "../entities/account.entity";

export class AccountDto{
    @Expose()
    id:number;
    
    @Expose()
    accountNumber:string;

    @Expose()
    accountType:AccountType;

    @Expose()
    balance:number;

    @Expose()
    status:AccountStatus;

    @Expose()
    createdAt:Date

    @Expose()
    updatedAt: Date
    
    @Expose()
    @Transform(({obj})=>obj.user?.id)
    userId:number;
}
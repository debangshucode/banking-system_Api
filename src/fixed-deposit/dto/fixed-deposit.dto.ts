import { Expose, Transform } from "class-transformer";
import { FdStatus } from "../entities/fixed-deposit.entity";

export class FixedDepositDto{
    @Expose()
    id:number;

    @Expose()
    principalAmount:number

    @Expose()
    tenure:number

    @Expose()
    interestRate:number

    @Expose()
    status: FdStatus

    @Expose()
    maturityDate: Date;

    @Expose()
    createdAt:Date;

    @Expose()
    @Transform(({obj})=>obj.account?.id)
    accountId:number
}
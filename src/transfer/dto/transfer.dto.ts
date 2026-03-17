import { Expose, Transform } from "class-transformer";
import { TransferStatus } from "../entities/transfer.entity";

export class TransferDto{
    @Expose()
    id:number ;

    @Expose()
    @Transform(({obj})=>obj.fromAccount?.id)
    fromAccountId: number;

    @Expose()
    @Transform(({obj})=>obj.toAccount?.id)
    toAccountId: number;

    @Expose()
    amount: number;

    @Expose()
    status:TransferStatus;

    @Expose()
    createdAt:Date;
}
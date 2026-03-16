import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { AccountStatus, AccountType } from "../entities/account.entity";

export class AccountDto{
    @ApiProperty({ example: 1 })
    @Expose()
    id:number;
    
    @ApiProperty({ example: '0000000001' })
    @Expose()
    accountNumber:string;

    @ApiProperty({ enum: AccountType, example: AccountType.SAVINGS })
    @Expose()
    accountType:AccountType;

    @ApiProperty({ example: 0 })
    @Expose()
    balance:number;

    @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE })
    @Expose()
    status:AccountStatus;

    @ApiProperty({ example: '2026-03-16T10:30:00.000Z' })
    @Expose()
    createdAt:Date

    @ApiProperty({ example: '2026-03-16T10:30:00.000Z' })
    @Expose()
    updatedAt: Date
    
    @ApiProperty({ example: 5 })
    @Expose()
    @Transform(({obj})=>obj.user?.id)
    userId:number;
}

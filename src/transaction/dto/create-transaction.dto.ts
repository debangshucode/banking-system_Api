import { IsEnum, IsNumber, IsPositive } from "class-validator";
import { TransactionType } from "../entities/transaction.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
    @ApiProperty({
        example: 1
    })
    @IsNumber()
    accountId:number

    @ApiProperty({
        example: 'DEPOSIT'
    })
    @IsEnum(TransactionType)
    transactionType:TransactionType

    @ApiProperty({
        example: 1000
    })
    @IsNumber()
    @IsPositive()
    amount:number;
}

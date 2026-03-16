import { IsEnum, IsInt } from "class-validator";
import { AccountType } from "../entities/account.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    userId: number;

    @ApiProperty({ enum: AccountType, example: AccountType.SAVINGS })
    @IsEnum(AccountType)
    accountType: AccountType
}

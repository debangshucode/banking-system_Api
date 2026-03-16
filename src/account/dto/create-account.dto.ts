import { IsEnum, IsInt } from "class-validator";
import { AccountType } from "../entities/account.entity";

export class CreateAccountDto {

    @IsInt()
    userId:number;

    @IsEnum(AccountType)
    accountType: AccountType
}

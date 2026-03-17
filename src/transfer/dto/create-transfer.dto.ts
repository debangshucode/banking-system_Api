import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateTransferDto {
    
    @ApiProperty({
        example:14
    })
    @IsNumber()
    fromAccountId : number;

    @ApiProperty({
        example:1
    })
    @IsNumber()
    toAccountId : number;

    @ApiProperty({
        example:500
    })
    @IsNumber()
    amount : number
}

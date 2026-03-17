import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateFixedDepositDto {

    @ApiProperty({
        example:17
    })
    @IsNumber()
    accountId:number
    
    @ApiProperty({
        example:10000
    })
    @IsNumber()
    principalAmount:number
    
    @ApiProperty({
        example:5
    })
    @IsNumber()
    tenure:number;

}

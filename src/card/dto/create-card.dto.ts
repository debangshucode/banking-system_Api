import { IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { CardType } from "../entities/card.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {

    @ApiProperty({
        example:17
    })
    @IsNumber()
    accountId:number;

    @ApiProperty({
        example:'DEBIT'
    })
    @IsEnum(CardType)
    cardType:CardType;

    @ApiProperty({
        example:1234
    })
    @IsString()
    @IsOptional()
    @Length(4,4)
    pin:string;
}

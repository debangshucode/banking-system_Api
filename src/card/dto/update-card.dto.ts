import { ApiProperty } from '@nestjs/swagger';
import { CardStatus } from '../entities/card.entity';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCardDto  {
    @ApiProperty({
        example:1234
    })
    @IsString()
    @IsOptional()
    @Length(4)
    currentPin: string;

    @ApiProperty({
        example:1111
    })
    @IsString()
    @IsOptional()
    @Length(4)
    newPin: string;

    @ApiProperty({
        example:'BLOCKED'
    })
    @IsEnum(CardStatus)
    @IsOptional()
    status: CardStatus;
}

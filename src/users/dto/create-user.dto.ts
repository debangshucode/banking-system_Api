import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'


export class CreateUserDto {
    @ApiProperty({
        example: 'user1@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456'
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'User20'
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: '7894561230'
    })
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    number: string;

    @ApiProperty({
        example: '42 MG Road, Indiranagar, Bengaluru, Karnataka 560038, India.'
    })
    @IsString()
    address: string;

}

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'


export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(10)
    number: string;

    @IsString()
    address: string;

}

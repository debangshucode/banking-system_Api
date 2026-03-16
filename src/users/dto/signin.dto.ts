import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class SignInDto {
    @ApiProperty({
        example:'user1@gmail.com'
    })
    @IsEmail()
    email:string;

    @ApiProperty({
        example:'123456'
    })
    @IsString()
    password:string;

}
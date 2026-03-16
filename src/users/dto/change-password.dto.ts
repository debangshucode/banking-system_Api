import { ApiProperty } from "@nestjs/swagger";
import { IsString,MinLength } from "class-validator"

export class ChangePasswordDto {
    @ApiProperty({
        example:'asdfghjkl'
    })
    @IsString()
    @MinLength(6)
    currentPassword: string;

    @ApiProperty({
        example:'newpassword'
    })
    @IsString()
    @MinLength(6)
    newPassword:string
}
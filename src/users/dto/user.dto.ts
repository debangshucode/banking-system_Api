import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserStatus } from "../entities/user.entity";


export class UserDto {

    @ApiProperty({ example: 1 })
    @Expose()
    id: number

    @ApiProperty({ example: 'user1@gmail.com' })
    @Expose()
    email: string;

    @ApiProperty({ example: 'User20' })
    @Expose()
    name: string;

    @ApiProperty({ example: '7894561230' })
    @Expose()
    number: string;

    @ApiProperty({ example: '42 MG Road, Indiranagar, Bengaluru, Karnataka 560038, India.' })
    @Expose()
    address: string;

    @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
    @Expose()
    status:UserStatus;

    @ApiProperty({ example: '2026-03-16T10:30:00.000Z' })
    @Expose()
    createdAt: Date;
}

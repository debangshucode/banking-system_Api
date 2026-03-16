import { Expose } from "class-transformer";
import { UserStatus } from "../entities/user.entity";


export class UserDto {

    @Expose()
    id: number

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    number: string;

    @Expose()
    address: string;

    @Expose()
    status:UserStatus;

    @Expose()
    createdAt: Date;
}

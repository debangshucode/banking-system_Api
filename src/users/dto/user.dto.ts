import { Expose } from "class-transformer";


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
    createdAt: Date;
}

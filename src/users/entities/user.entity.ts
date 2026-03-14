import { PrimaryGeneratedColumn,Entity,Column,CreateDateColumn, OneToMany } from "typeorm";
import {Account} from "../../account/entities/account.entity"


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column()
    name:string;

    @Column()
    number:string;

    @Column()
    address:string;

    @CreateDateColumn()
    createdAt:Date;
    
    @OneToMany(()=>Account,(account)=>account.user)
    accounts: Account[];
    
}

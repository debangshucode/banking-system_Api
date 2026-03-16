import { PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { Account } from "../../account/entities/account.entity"

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    number: string;

    @Column()
    address: string;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
    })
    status: UserStatus;

    @CreateDateColumn()
    createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;



    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

}

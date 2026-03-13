import { Account } from "src/account/entities/account.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";


export enum FdStatus {
    ACTIVE = 'ACTIVE',
    MATURED = 'MATURED',
    CLOSED = 'CLOSED'
}
@Entity()
export class FixedDeposit {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    principalAmount: number;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2
    })
    interestRate: number;

    @Column()
    tenure: number;

    @Column({
        type: 'enum',
        enum: FdStatus
    })
    status: FdStatus;
    
    @Column()
    maturityDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Account, (account) => account.fixedDeposits)
    account: Account;

}


import { Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Card } from "../../card/entities/card.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";
import { Transfer } from "../../transfer/entities/transfer.entity";
import { FixedDeposit } from "../../fixed-deposit/entities/fixed-deposit.entity";


export enum AccountType {
    SAVINGS = "SAVINGS",
    CURRENT = "CURRENT",
    BUSINESS = "BUSINESS"
}

export enum AccountStatus {
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    PAUSED = "PAUSED"
}
@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    accountNumber: string;

    @Column({
        type: "enum",
        enum: AccountType,
    })
    accountType: AccountType;

    @Column()
    balance: number;

    @Column({
        type: "enum",
        enum: AccountStatus,
    })
    status: AccountStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.accounts)
    user: User;

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[];

    @OneToMany(() => Transfer, (transfer) => transfer.fromAccount)
    sentTransfers: Transfer[];
    
    @OneToMany(() => Transfer, (transfer) => transfer.toAccount)
    receivedTransfers: Transfer[];

    @OneToMany(() => Card, (card) => card.account)
    cards: Card[];

    @OneToMany(()=>FixedDeposit,(fixedDeposit)=>fixedDeposit.account)
    fixedDeposits:FixedDeposit[]; 
}

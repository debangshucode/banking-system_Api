import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,CreateDateColumn } from "typeorm";
import { Account } from "../../account/entities/account.entity";
import { Transfer } from "../../transfer/entities/transfer.entity";


export enum TransactionType {
    DEPOSIT='DEPOSIT',
    WITHDRAWAL='WITHDRAWAL',
}

export enum TransactionStatus {
    PENDING='PENDING',
    SUCCESS='SUCCESS',
    FAILED='FAILED'
}
@Entity()
export class Transaction {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:"enum",
        enum:TransactionType,
    })
    transactionType:TransactionType;

    @Column()
    amount:number;

    @Column({
        type:'enum',
        enum:TransactionStatus,
        default:TransactionStatus.PENDING
    })
    status:TransactionStatus

    @CreateDateColumn()
    createdAt:Date;

    @ManyToOne(()=>Account,(account)=>account.transactions)
    account:Account;

    @ManyToOne(()=>Transfer,(transfer)=>transfer.transactions, {nullable:true})
    transfer?:Transfer;
}

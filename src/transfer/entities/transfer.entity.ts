import { PrimaryGeneratedColumn,Column,CreateDateColumn,Entity,OneToMany,ManyToOne } from "typeorm";
import { Account } from "../../account/entities/account.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";

export enum TransferStatus {
    PENDING='PENDING',
    SUCCESS='SUCCESS',
    FAILED='FAILED'
}
@Entity()

export class Transfer {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    amount:number;

    @Column({
        type:'enum',
        enum:TransferStatus,
    })
    status:TransferStatus

    @CreateDateColumn()
    createdAt:Date;


    @ManyToOne(()=>Account,(account)=>account.sentTransfers,{nullable:false})
    fromAccount:Account;

    @ManyToOne(()=>Account,(account)=>account.receivedTransfers,{nullable:false})
    toAccount:Account;

    @OneToMany(()=>Transaction,(transaction)=>transaction.transfer)
    transactions:Transaction[];
}

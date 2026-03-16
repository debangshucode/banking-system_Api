import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, ManyToOne } from "typeorm";
import { Account } from "../../account/entities/account.entity";


export enum CardType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT'
}

export enum CardStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
    EXPIRED = "EXPIRED"
}


@Entity()
export class Card {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cardNumber: string;

    @Column({
        type: 'enum',
        enum: CardType,
    })
    cardType: CardType;

    @Column({
        type: 'enum',
        enum: CardStatus,
        default:CardStatus.ACTIVE
    })
    status: CardStatus;

    @Column({
        length: 4
    })
    cvv: string;


    @Column({
        nullable: true
    })
    pin: string;

    @Column()
    expiryDate: Date;

    @CreateDateColumn()
    createdAt: Date


    @ManyToOne(() => Account, (account) => account.cards)
    account: Account;

}

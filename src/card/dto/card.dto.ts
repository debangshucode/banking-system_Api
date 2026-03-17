import { Expose, Transform } from "class-transformer";
import { CardStatus, CardType } from "../entities/card.entity";

export class CardDto{
    @Expose()
    id:number;

    @Expose()
    cardNumber:string;

    @Expose()
    cardType:CardType;

    @Expose()
    status:CardStatus;

    @Expose()
    expiryDate:Date;
    
    @Expose()
    createdAt:Date;

    @Expose()
    @Transform(({obj})=>obj.account?.id)
    accountId:number;
}
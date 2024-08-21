import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { BaseEntity } from "../base/base.entity";
import { TransactionStatusEnum } from "src/enum/transaction-status/transaction-status.enum";
import { TransactionTypeEnum } from "src/enum/transaction-type/transaction-type.enum";

@Entity({ name: "transactions" })
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user?.id)
    @JoinColumn({ name: "fromUserId" })
    fromUser: User;

    @ManyToOne(() => User, user => user?.id)
    @JoinColumn({ name: "toUserId" })
    toUser: User;

    @Column({
        type: 'float',
        nullable: false,
        default: 0,
    })
    amount: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        default: TransactionStatusEnum.PENDING,
        enum: TransactionStatusEnum,
    })
    transactionStatus: TransactionStatusEnum;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        enum: TransactionTypeEnum,
    })
    transactionType: TransactionTypeEnum;
}
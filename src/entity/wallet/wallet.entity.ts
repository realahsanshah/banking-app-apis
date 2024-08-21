import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { BaseEntity } from "../base/base.entity";

@Entity({ name: "wallets" })
export class Wallet extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    account_number: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    iban: string;

    @Column({
        type: 'float',
        nullable: false,
        default: 0,
    })
    balance: number;

    @Column({
        type: 'boolean',
        nullable: false,
        default: true,
    })
    is_active: boolean;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    is_freezed: boolean;
}
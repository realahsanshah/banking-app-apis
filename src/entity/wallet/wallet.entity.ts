import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity({ name: "wallets" })
export class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'uuid',
        nullable: false,
    })
    @ManyToOne(() => User, user => user.id)
    user: User;
}
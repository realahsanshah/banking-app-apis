import { GenderEnum } from "src/enum/gender/gender.enum";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Otp } from "../otp/otp.entity";
import { BaseEntity } from "../base/base.entity";
import { Wallet } from "../wallet/wallet.entity";
import { Transaction } from "../transaction/transaction.entity";

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        // transformer: {
        //     to: (value: string) => value.toLowerCase(),
        //     from: (value: string) => value,
        // },
    })
    @Index({ unique: true, where: 'is_deleted = false' })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    full_name: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    cnic: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    "isVerified": boolean;

    // Gender=> Male, Female
    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
        enum: GenderEnum,
    })
    gender: GenderEnum;

    @OneToMany(() => Otp, otp => otp.user)
    otps: Otp[];

    @OneToMany(() => Wallet, wallet => wallet.user)
    wallets: Wallet[];

    // @OneToMany(() => Transaction, transaction => transaction.fromUser)
    // fromTransactions: Transaction[]


    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async checkPassword(rawPassword: string) {
        return await bcrypt.compare(rawPassword, this.password);
    }

    // remove password from response
    toJSON() {
        const { password, ...rest } = this;
        return rest;
    }
}

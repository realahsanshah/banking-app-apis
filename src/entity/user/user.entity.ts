import { GenderEnum } from "src/enum/gender/gender.enum";
import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Otp } from "../otp/otp.entity";

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        transformer: {
            to: (value: string) => value.toLowerCase(),
            from: (value: string) => value,
        },
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

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    is_deleted: boolean;

    @OneToMany(() => Otp, otp => otp.user)
    otps: Otp[];

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

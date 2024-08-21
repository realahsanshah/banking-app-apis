import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { OtpTypeEnum } from "src/enum/otp-type/otp-type.enum";

@Entity({ name: 'otps' })
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User

    @Column({
        type: 'varchar',
        length: 6,
        nullable: false,
    })
    code: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        enum: OtpTypeEnum,
    })
    otpType: OtpTypeEnum;

    @Column({
        type: 'timestamp',
        nullable: false,
        // default is 2 minute from now
        default: () => 'CURRENT_TIMESTAMP + INTERVAL 2 MINUTE',
    })
    expiresAt: Date;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    isUsed: boolean;
}
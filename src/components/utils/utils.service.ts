import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SendEmailDTO } from './dto/sendEmail.dto';
import { OtpTypeEnum } from 'src/enum/otp-type/otp-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/entity/otp/otp.entity';

@Injectable()
export class UtilsService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    ) { }

    async commitTransactions(
        transactions: Array<any>,
    ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const transaction of transactions) {
                await queryRunner.manager.save(transaction);
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async sendEmail(sendEmailDto: SendEmailDTO) {
        // Send email logic here
        return {
            message: 'Email sent successfully',
        }
    }

    async sendOtp(userId:string,email: string, otpType: OtpTypeEnum) {
        // generate random 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        // save otp in database
        const otpEntity = new Otp();
        otpEntity.userId = userId;
        otpEntity.code = otp?.toString();
        otpEntity.otpType = otpType;
        await this.otpRepository.save(otpEntity);

        // send otp to email
        await this.sendEmail({
            to: [email],
            subject: 'OTP',
            text: `Your OTP is ${otp}`,
        });

        return {
            message: 'OTP sent successfully',
        }
    }
}

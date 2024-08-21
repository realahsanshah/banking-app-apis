import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SendEmailDTO } from './dto/sendEmail.dto';
import { OtpTypeEnum } from '../../enum/otp-type/otp-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../../entity/otp/otp.entity';
import { User } from '../../entity/user/user.entity';
import * as nodemailer from 'nodemailer';
import { getOtpEmail } from '../../common/emails/otp-email.email';
import { NodeEnvEnum } from '../../enum/node-env/node-env.enum';

@Injectable()
export class UtilsService {
  private transporter;
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async commitTransactions(transactions: Array<any>) {
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
    if (process.env.NODE_ENV === NodeEnvEnum.TEST) {
      return {
        message: 'Email sent successfully',
      };
    }
    // Send email logic here
    await this.transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: sendEmailDto.to.join(', '),
      subject: sendEmailDto.subject,
      html: sendEmailDto.html,
    });

    return {
      message: 'Email sent successfully',
    };
  }

  async sendOtp(user: User, email: string, otpType: OtpTypeEnum, name: string) {
    // generate random 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // save otp in database
    const otpEntity = new Otp();
    otpEntity.user = user;
    otpEntity.code = otp?.toString();
    otpEntity.otpType = otpType;
    otpEntity.expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    await this.otpRepository.save(otpEntity);

    // send otp to email
    await this.sendEmail({
      to: [email],
      subject: 'OTP',
      html: getOtpEmail(name, otpEntity?.code),
    });

    return {
      message: 'OTP sent successfully',
    };
  }
}

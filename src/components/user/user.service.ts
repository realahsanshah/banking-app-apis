import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { SignupDTO } from '../auth/dto/signup.dto';
import { OtpDTO } from '../auth/dto/otp.dto';
import { Otp } from 'src/entity/otp/otp.entity';
import { UtilsService } from '../utils/utils.service';
import { LoginDTO } from '../auth/dto/login.dto';
import { OtpTypeEnum } from 'src/enum/otp-type/otp-type.enum';
import { EmailDTO } from '../auth/dto/email.dto';
import { PasswordDTO } from '../auth/dto/password.dto';
import { Wallet } from 'src/entity/wallet/wallet.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
        @InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>,
        private walletService: WalletService,
        private utilsService: UtilsService
    ) {
        // this.deleteData();
    }

    async deleteData() {
        await this.walletRepository.delete({});
        await this.otpRepository.delete({});
        await this.userRepository.delete({});

    }

    async createUser(signupDto: SignupDTO) {
        const existingUser = await this.userRepository.findOne({
            where: {
                email: signupDto?.email,
                isVerified: true,
            }
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const otps = await this.otpRepository.find({
            where: {
                user: {
                    email: signupDto?.email,
                },
            },
        });
        await Promise.all(otps.map(async (otp) => {
            await this.otpRepository.delete(otp);
        }))

        await this.userRepository.delete({
            email: signupDto?.email,
        })

        const user = new User();

        user.email = signupDto?.email;
        user.password = signupDto?.password;
        user.full_name = signupDto?.full_name;
        user.cnic = signupDto?.cnic;
        user.gender = signupDto?.gender

        await user.hashPassword();

        await this.userRepository.save(user);

        await this.utilsService.sendOtp(user, signupDto?.email, OtpTypeEnum.VERIFY_USER, user?.full_name);

        return user?.toJSON();
    }

    async resendOtp(emailDto: EmailDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: emailDto.email,
                is_deleted: false,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const type = user?.isVerified ? OtpTypeEnum.FORGOT_PASSWORD : OtpTypeEnum.VERIFY_USER;

        await this.utilsService.sendOtp(user, emailDto?.email, type, user?.full_name);

        return {
            message: 'OTP sent successfully',
        }
    }

    async verifyUser(otpDto: OtpDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: otpDto.email,
                isVerified: false,
                is_deleted: false,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const otp = await this.otpRepository.findOne({
            where: {
                user: {
                    id: user?.id,
                },
                code: otpDto?.otp,
                isUsed: false,
                otpType: OtpTypeEnum.VERIFY_USER,
            }
        });

        if (!otp) {
            throw new Error('Invalid OTP');
        }

        // check expiry of otp
        if (otp?.expiresAt < new Date()) {
            throw new Error('OTP expired');
        }

        user.isVerified = true;

        otp.isUsed = true;

        const wallet = this.walletService.createWallet();

        wallet.user = user;

        await this.utilsService.commitTransactions([
            user,
            otp,
            wallet,
        ]);

        return user?.toJSON();
    }

    async login(loginDto: LoginDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: loginDto.email,
                isVerified: true,
                is_deleted: false,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordMatched = await user.checkPassword(loginDto?.password);

        if (!isPasswordMatched) {
            throw new Error('Invalid password');
        }

        return user?.toJSON();
    }

    async forgotPassword(emailDto: EmailDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: emailDto.email,
                isVerified: true,
                is_deleted: false,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        await this.utilsService.sendOtp(user, emailDto?.email, OtpTypeEnum.FORGOT_PASSWORD, user?.full_name);

        return {
            message: 'OTP sent successfully',
        }
    }

    async verifyForgotPasswordOtp(otpDto: OtpDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: otpDto.email,
                is_deleted: false,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const otp = await this.otpRepository.findOne({
            where: {
                user: user,
                code: otpDto?.otp,
                isUsed: false,
                otpType: OtpTypeEnum.FORGOT_PASSWORD,
            }
        });

        if (!otp) {
            throw new Error('Invalid OTP');
        }

        // check expiry of otp
        if (otp?.expiresAt < new Date()) {
            throw new Error('OTP expired');
        }

        otp.isUsed = true;

        await this.utilsService.commitTransactions([
            otp,
        ]);

        return {
            message: 'OTP verified successfully',
            user: user?.toJSON(),
        }
    }

    async resetPassword(passwordDto: PasswordDTO, user) {
        const userData = await this.userRepository.findOne({
            where: {
                email: user.email,
                is_deleted: false,
            }
        });

        if (!user?.isForgotPassword) {
            throw new Error('User not allowed to reset password');
        }

        userData.password = passwordDto?.password;

        await userData.hashPassword();

        await this.userRepository.save(userData);

        return {
            message: 'Password reset successfully',
        }
    }
}


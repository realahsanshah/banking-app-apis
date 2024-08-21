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

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
        private utilsService: UtilsService
    ) { }

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

        await this.userRepository.delete({
            email: signupDto?.email,
        })

        const user = new User();

        user.email = signupDto?.email;
        user.password = signupDto?.password;
        user.full_name = signupDto?.full_name;
        user.cnic = signupDto?.cnic;
        user.gender = signupDto?.gender
        debugger
        await user.hashPassword();
        debugger
        await this.userRepository.save(user);
        debugger

        await this.utilsService.sendOtp(user?.id, signupDto?.email, OtpTypeEnum.VERIFY_USER);

        return user?.toJSON();
    }

    async verifyUser(otpDto: OtpDTO) {
        const user = await this.userRepository.findOne({
            where: {
                email: otpDto.email,
                isVerified: false,
                is_deleted: false,
            }
        });

        debugger

        if (!user) {
            throw new Error('User not found');
        }
        debugger
        const otp = await this.otpRepository.findOne({
            where: {
                userId: user?.id,
                code: otpDto?.otp,
                isUsed: false,
            }
        });
        debugger
        // check expiry of otp
        if (otp?.expiresAt < new Date()) {
            throw new Error('OTP expired');
        }

        user.isVerified = true;

        otp.isUsed = true;

        await this.utilsService.commitTransactions([
            user,
            otp,
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

        await this.utilsService.sendOtp(user?.id, emailDto?.email, OtpTypeEnum.FORGOT_PASSWORD);

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
                userId: user?.id,
                code: otpDto?.otp,
                isUsed: false,
                otpType: OtpTypeEnum.FORGOT_PASSWORD,
            }
        });

        // check expiry of otp
        if (otp.expiresAt < new Date()) {
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
        if (!user?.isForgotPassword) {
            throw new Error('User not allowed to reset password');
        }

        user.password = passwordDto?.password;

        await user.hashPassword();

        await this.userRepository.save(user);

        return {
            message: 'Password reset successfully',
        }
    }
}


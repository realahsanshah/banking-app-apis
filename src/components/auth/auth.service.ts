import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDTO } from './dto/signup.dto';
import { OtpDTO } from './dto/otp.dto';
import { LoginDTO } from './dto/login.dto';
import { EmailDTO } from './dto/email.dto';
import { PasswordDTO } from './dto/password.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    generateToken(user) {
        return {
            access_token: this.jwtService.sign(user),
        }
    }

    async signup(signupDto: SignupDTO) {
        const user = await this.userService.createUser(signupDto);

        return {
            message: 'User created successfully',
            user: user,
        }
    }

    async verifyUser(otpDto: OtpDTO) {
        const user = await this.userService.verifyUser(otpDto);

        return {
            ...this.generateToken(user),
            user: user,
        };
    }

    async login(loginDto: LoginDTO) {
        const user = await this.userService.login(loginDto);

        return {
            ...this.generateToken(user),
            user: user,
        };
    }

    async forgotPassword(emailDto: EmailDTO) {
        await this.userService.forgotPassword(emailDto);

        return {
            message: 'Email sent successfully',
        };
    }

    async verifyForgotPasswordOtp(otpDto: OtpDTO) {
        const user = await this.userService.verifyForgotPasswordOtp(otpDto);



        return {
            ...this.generateToken({
                ...user,
                isForgotPassword: true,
            }),
            user: user,
        };
    }

    async resetPassword(passwordDto: PasswordDTO, user) {
        const userData = await this.userService.resetPassword(passwordDto, user);

        return {
            ...this.generateToken(userData),
            user: userData,
        };
    }
}

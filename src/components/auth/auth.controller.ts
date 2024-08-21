import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { OtpDTO } from './dto/otp.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from 'src/decorator/user.decorator';
import { EmailDTO } from './dto/email.dto';
import { PasswordDTO } from './dto/password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private _authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDTO) {
        return await this._authService.signup(signupDto);
    }

    @Post('verifyOtp')
    async verifyOtp(@Body() otpDto: OtpDTO) {
        return await this._authService.verifyUser(otpDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDTO) {
        return await this._authService.login(loginDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('getLoggedInUser')
    async getLoggedInUser(@GetUser() user) {
        return user;
    }

    @Post('forgotPassword')
    async forgotPassword(@Body() emailDto: EmailDTO) {
        return await this._authService.forgotPassword(emailDto);
    }

    @Post('verifyForgotPasswordOtp')
    async verifyForgotPasswordOtp(@Body() otpDto: OtpDTO) {
        return await this._authService.verifyForgotPasswordOtp(otpDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('resetPassword')
    async resetPassword(@Body() passwordDto: PasswordDTO, @GetUser() user) {
        return await this._authService.resetPassword(passwordDto, user);
    }

}

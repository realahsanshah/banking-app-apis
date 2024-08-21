import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from 'supertest';
import { AppModule } from "../../src/app.module";
import { SignupDTO } from "../../src/components/auth/dto/signup.dto";
import { GenderEnum } from "../../src/enum/gender/gender.enum";
import { Helper } from "../helper";
import { LoginDTO } from "../../src/components/auth/dto/login.dto";
import { OtpTypeEnum } from "../../src/enum/otp-type/otp-type.enum";
import { OtpDTO } from "../../src/components/auth/dto/otp.dto";
import { PasswordDTO } from "../../src/components/auth/dto/password.dto";

let app: INestApplication;
let helper: Helper;
beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    helper = new Helper(app);
    await helper.init();
})

describe('User', () => {
    it("Test /signup", async () => {

        const userData: SignupDTO = {
            email: "test@gmail.com",
            password: "Test@123",
            full_name: "Test",
            cnic: "1234567891234",
            gender: GenderEnum.FEMALE,
        }

        const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(userData)

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');

        const otp = await helper.dataSource.getRepository('Otp').findOne({
            where: {
                user: {
                    id: response?.body?.user?.id
                }
            }
        });

        const verifyResponse = await request(app.getHttpServer())
            .post('/auth/verifyOtp')
            .send({
                email: userData.email,
                otp: otp?.code
            })

        expect(verifyResponse.status).toBe(201);

    })

    it("Test /signup with existing user", async () => {

        const userData: SignupDTO = {
            email: "test@gmail.com",
            password: "Test@123",
            full_name: "Test",
            cnic: "1234567891234",
            gender: GenderEnum.FEMALE,
        }

        const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(userData)

        console.log(response.body);
        expect(response.status).toBe(500);

    })

    it("Test /signup with invalid email", async () => {

        const userData: SignupDTO = {
            email: "test",
            password: "Test@123",
            full_name: "Test",
            cnic: "123456789123",
            gender: GenderEnum?.FEMALE,
        }

        const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(userData)

        expect(response.status).toBe(400);
    });

    it("Test /login with invalid email", async () => {

        const userData = {
            email: "test",
            password: "Test@123",
        }

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(userData)

        expect(response.status).toBe(400);

    });

    it("Test /login with invalid password", async () => {

        const userData: LoginDTO = {
            email: "test@gmail.com",
            password: "Test@1234",
        }

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(userData)

        expect(response.status).toBe(500);
    });

    it("Test /login", async () => {

        const userData: LoginDTO = {
            email: "test@gmail.com",
            password: "Test@123",
        }

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(userData)

        expect(response.status).toBe(201);

        helper.token = response?.body?.access_token;
    });

    it("Test /getLoggedInUser", async () => {
        const response = await request(app.getHttpServer())
            .get('/auth/getLoggedInUser').set("Authorization", helper?.getToken());

        expect(response?.statusCode).toBe(200);
    });

    it("Test /forgotPassword", async () => {
        const email = {
            email: "test@gmail.com",
        }

        const response = await request(app.getHttpServer())
            .post('/auth/forgotPassword')
            .send(email)

        expect(response.statusCode).toBe(201);
    })

    it("Test /verifyForgotPasswordOtp", async () => {
        const otp = await helper.dataSource.getRepository('Otp').findOne({
            where: {
                otpType: OtpTypeEnum.FORGOT_PASSWORD,
            },
        });

        const emailOtp: OtpDTO = {
            email: "test@gmail.com",
            otp: otp?.code,
        };
        debugger
        const response = await request(app.getHttpServer())
            .post('/auth/verifyForgotPasswordOtp')
            .send(emailOtp)

        expect(response?.statusCode).toBe(201);

        const token = response?.body?.access_token;
        debugger
        const passwordDto: PasswordDTO = {
            password: 'Abc@1234',
        }
        debugger
        const resetPassword = await request(app.getHttpServer())
            .post('/auth/resetPassword')
            .set('Authorization', token)
            .send(passwordDto)
        debugger
        expect(resetPassword).toBe(201);

        const emailDto = {
            email: 'test@gmail.com',
            password: "Abc@1234",
        }

        const responseLogin = await request(app.getHttpServer())
            .post("/auth/login")
            .send(emailDto)

        expect(responseLogin.statusCode).toBe(201);
    })

});


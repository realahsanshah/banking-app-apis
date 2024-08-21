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
import { Reflector } from "@nestjs/core";
import { HttpExceptionFilter } from "../../src/filters/bad-request.filter";
import { ErrorFilter } from "../../src/filters/exception.filter";
import { QueryFailedFilter } from "../../src/filters/query-failed.filter";
import { AmountDTO } from "src/components/wallet/dto/amount.dto";
import { TransferDTO } from "src/components/wallet/dto/transfer.dto";

let app: INestApplication;
let helper: Helper;
beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    const reflector = app.get(Reflector);

    app.useGlobalFilters(
        new HttpExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
        new ErrorFilter(reflector)
    );
    await app.init();
    helper = new Helper(app);
    await helper.init();
})
let token: string = '';
describe('Wallet', () => {

    it("Test /login", async () => {
        const userData: SignupDTO = {
            email: "test2@gmail.com",
            password: "Test@123",
            full_name: "Test",
            cnic: "1234567891234",
            gender: GenderEnum.FEMALE,
        }

        const signupResponse = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(userData);

        const otp = await helper.dataSource.getRepository('Otp').findOne({
            where: {
                user: {
                    id: signupResponse?.body?.user?.id
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


        const response = await request(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: userData?.email,
                password: userData?.password,
            })

        expect(response.statusCode).toBe(201);

        token = response?.body?.access_token;
    })

    it("Test /getWallet", async () => {
        const response = await request(app.getHttpServer())
            .get('/wallet/getWallet')
            .set('Authorization', token);

        expect(response.statusCode).toBe(200)
    })

    it("Test /depositAmount", async () => {
        const amountDto: AmountDTO = {
            amount: 100,
        }
        const amountRes = await request(app.getHttpServer())
            .post('/wallet/depositAmount')
            .set('Authorization', token)
            .send(amountDto);

        expect(amountRes.statusCode).toBe(201);
    })

    it("Test /withdrawAmount", async () => {
        const amountDto: AmountDTO = {
            amount: 100,
        }
        const amountRes = await request(app.getHttpServer())
            .post('/wallet/withdrawAmount')
            .set('Authorization', token)
            .send(amountDto);

        expect(amountRes.statusCode).toBe(201);
    });

    it("Test /transfer", async () => {
        const receivingUser = await helper.dataSource.getRepository('User').findOne({
            where: {
                email: 'test@gmail.com',
            }
        });

        const receivingWallet = await helper.dataSource.getRepository('Wallet').findOne({
            where: {
                user: {
                    id: receivingUser?.id,
                },
            },
        });

        const transferDto: TransferDTO = {
            iban: receivingWallet?.iban,
            amount: 10,
        }
        const amountRes = await request(app.getHttpServer())
            .post('/wallet/transferAmount')
            .set('Authorization', token)
            .send(transferDto);

        expect(amountRes.statusCode).toBe(201);
    })


});


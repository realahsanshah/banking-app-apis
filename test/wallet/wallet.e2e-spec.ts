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

describe('Wallet', () => {

    it("Test /login", async () => {
        const emailDto = {
            email: 'test@gmail.com',
            password: "Abc@1234",
        }

        const response = await request(app.getHttpServer())
            .post("/auth/login")
            .send(emailDto)

        expect(response.statusCode).toBe(201);

        helper.token = response?.body?.access_token;
        debugger
    })

    it("Test /getWallet", async () => {

    })
});


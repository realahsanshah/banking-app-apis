import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SignupDTO } from '../../src/components/auth/dto/signup.dto';
import { GenderEnum } from '../../src/enum/gender/gender.enum';
import { Helper } from '../helper';
import { LoginDTO } from '../../src/components/auth/dto/login.dto';
import { OtpTypeEnum } from '../../src/enum/otp-type/otp-type.enum';
import { OtpDTO } from '../../src/components/auth/dto/otp.dto';
import { PasswordDTO } from '../../src/components/auth/dto/password.dto';
import { Reflector } from '@nestjs/core';
import { QueryFailedFilter } from '../../src/filters/query-failed.filter';
import { HttpExceptionFilter } from '../../src/filters/bad-request.filter';
import { ErrorFilter } from '../../src/filters/exception.filter';

let app: INestApplication;
let helper: Helper;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
    new ErrorFilter(reflector),
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  helper = new Helper(app);
  await helper.init();
});

describe('User', () => {
  it('Test /signup', async () => {
    const userData: SignupDTO = {
      email: 'test@gmail.com',
      password: 'Test@123',
      full_name: 'Test',
      cnic: '1234567891234',
      gender: GenderEnum.FEMALE,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');

    const otp = await helper.dataSource.getRepository('Otp').findOne({
      where: {
        user: {
          id: response?.body?.user?.id,
        },
      },
    });

    const verifyResponse = await request(app.getHttpServer())
      .post('/auth/verifyOtp')
      .send({
        email: userData.email,
        otp: otp?.code,
      });

    expect(verifyResponse.status).toBe(201);
  });

  it('Test /signup with existing user', async () => {
    const userData: SignupDTO = {
      email: 'test@gmail.com',
      password: 'Test@123',
      full_name: 'Test',
      cnic: '1234567891234',
      gender: GenderEnum.FEMALE,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData);

    console.log(response.body);
    expect(response.status).toBe(400);
  });

  it('Test /signup with invalid email', async () => {
    const userData: SignupDTO = {
      email: 'test',
      password: 'Test@123',
      full_name: 'Test',
      cnic: '123456789123',
      gender: GenderEnum?.FEMALE,
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData);

    expect(response.status).toBe(400);
  });

  it('Test /login with invalid email', async () => {
    const userData = {
      email: 'test',
      password: 'Test@123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userData);

    expect(response.status).toBe(400);
  });

  it('Test /login with invalid password', async () => {
    const userData: LoginDTO = {
      email: 'test@gmail.com',
      password: 'Test@1234',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userData);

    expect(response.status).toBe(400);
  });

  it('Test /login', async () => {
    const userData: LoginDTO = {
      email: 'test@gmail.com',
      password: 'Test@123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userData);

    expect(response.status).toBe(201);

    helper.token = response?.body?.access_token;
  });
});

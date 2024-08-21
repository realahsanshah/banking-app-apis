import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/filters/bad-request.filter';
import { QueryFailedFilter } from '../src/filters/query-failed.filter';
import { ErrorFilter } from '../src/filters/exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const reflector = app.get(Reflector);

    app.useGlobalFilters(
      new HttpExceptionFilter(reflector),
      new QueryFailedFilter(reflector),
      new ErrorFilter(reflector),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});

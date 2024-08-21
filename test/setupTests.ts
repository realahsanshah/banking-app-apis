import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { HttpExceptionFilter } from 'src/filters/bad-request.filter';
import { ErrorFilter } from 'src/filters/exception.filter';
import { QueryFailedFilter } from 'src/filters/query-failed.filter';

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
    new ErrorFilter(reflector),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.init();
  await app.close();
});

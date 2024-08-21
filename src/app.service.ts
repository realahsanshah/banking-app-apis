import { Injectable } from '@nestjs/common';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { createDatabase } from 'typeorm-extension';
import { User } from './entity/user/user.entity';
import { Otp } from './entity/otp/otp.entity';
import { Wallet } from './entity/wallet/wallet.entity';
import { Transaction } from './entity/transaction/transaction.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  static async createConnection() {
    const connectionObject = {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        User,
        Otp,
        Wallet,
        Transaction,
      ],
      synchronize: true,
    };

    await createDatabase({
      ifNotExist: true,
      options: {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        synchronize: true,
      },
    });

    return connectionObject as TypeOrmModuleAsyncOptions;
  }
}

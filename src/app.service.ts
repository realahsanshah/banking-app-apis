import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  static async createConnection() {
    const connectionObject: TypeOrmModuleAsyncOptions = {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [__dirname + './../**/**.entity{.ts,.js}'],
      synchronize: true,
    };
    await createDatabase({
      ifNotExist: true,
      options: connectionObject,
    });

    return connectionObject;
  }
}

import { INestApplication } from "@nestjs/common";
import { AppService } from "../src/app.service";
import { DataSource } from "typeorm";
import { Otp } from "../src/entity/otp/otp.entity";
import { Wallet } from "../src/entity/wallet/wallet.entity";
import { User } from "../src/entity/user/user.entity";
import { Transaction } from "../src/entity/transaction/transaction.entity";

export class Helper {
    public app: INestApplication;
    public dataSource: DataSource;
    public token: string;

    constructor(app) {
        this.app = app;
        this.dataSource = new DataSource(AppService.getConnectionOptions() as any);
    }

    async init() {
        await this.dataSource.connect();
        await this.clearDatabase();
    }
    async clearDatabase() {
        const entities = [
            Otp,
            Transaction,
            Wallet,
            User,
        ]

        for (const entity of entities) {
            const repository = this.dataSource.getRepository(entity.name);
            await repository.delete({})
        }
    }

    getToken() {
        return this.token;
    }


}
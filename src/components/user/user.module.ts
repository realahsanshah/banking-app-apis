import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entity/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Otp } from '../../entity/otp/otp.entity';
import { UtilsService } from '../utils/utils.service';
import { Wallet } from '../../entity/wallet/wallet.entity';
import { WalletModule } from '../wallet/wallet.module';
import { WalletService } from '../wallet/wallet.service';
import { WalletWithUserView } from '../../view-entity/wallet-with-user/wallet-with-user.view-entity';
import { TransactionView } from '../../view-entity/transaction-view/transaction.view-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Otp,
      Wallet,
      WalletWithUserView,
      TransactionView,
    ]),
    JwtModule.registerAsync({
      imports: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '360000000s' },
          global: true,
        };
      },
    }),
    WalletModule,
  ],
  controllers: [UserController],
  providers: [UserService, UtilsService, WalletService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user/user.entity';
import { Wallet } from '../../entity/wallet/wallet.entity';
import { JwtModule } from '@nestjs/jwt';
import { UtilsService } from '../utils/utils.service';
import { Transaction } from '../../entity/transaction/transaction.entity';
import { Otp } from '../../entity/otp/otp.entity';
import { WalletWithUserView } from '../../view-entity/wallet-with-user/wallet-with-user.view-entity';
import { TransactionView } from '../../view-entity/transaction-view/transaction.view-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Transaction,
      Otp,
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
  ],
  controllers: [WalletController],
  providers: [WalletService, UtilsService],
  exports: [WalletModule],
})
export class WalletModule {}

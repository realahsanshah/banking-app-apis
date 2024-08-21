import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Wallet } from 'src/entity/wallet/wallet.entity';
import { JwtModule } from '@nestjs/jwt';
import { UtilsService } from '../utils/utils.service';
import { Transaction } from 'src/entity/transaction/transaction.entity';
import { Otp } from 'src/entity/otp/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Transaction,
      Otp,
    ]),
    JwtModule.registerAsync({
      imports: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '360000000s' },
          global: true,
        }
      }
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService, UtilsService],
  exports: [WalletModule],
})
export class WalletModule { }

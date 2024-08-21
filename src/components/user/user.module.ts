import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entity/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Otp } from 'src/entity/otp/otp.entity';
import { UtilsService } from '../utils/utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
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
  controllers: [UserController],
  providers: [UserService, UtilsService],
  exports: [UserService],
})
export class UserModule { }

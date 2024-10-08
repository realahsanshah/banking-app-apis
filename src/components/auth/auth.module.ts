import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { User } from '../../entity/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt-strategy';

@Module({})
export class AuthModule {
  static forRoot() {
    return {
      imports: [
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
        TypeOrmModule.forFeature([User]),
        UserModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
      module: AuthModule,
    };
  }
}

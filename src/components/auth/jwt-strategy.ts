import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Add your validation logic here
    // For example, you can check if the user exists in the database
    // and return the user object if valid, or throw an error if not valid
    // You can also add additional checks like checking the user's role, etc.
    return { userId: payload.sub, username: payload.username };
  }
}

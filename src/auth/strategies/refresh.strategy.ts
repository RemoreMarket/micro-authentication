import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      passReqToCallback: true,
    });
  }

  validate(req: any, payload: any) {
    const refreshToken = req.get('Authorization')?.replace('Bearer ', '');
    return { ...payload, refreshToken };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['emails', 'name'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { id, emails } = profile;
    const user = {
      id,
      email: emails?.[0]?.value,
    };
    done(null, user);
  }
}

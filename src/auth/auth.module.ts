import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refresh.guard';
import { RedisModule } from '../redis/redis.service';
import { EmailService } from '../utils/email.service';
import { UserEventsPublisher } from '../events/user-events.publisher';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    RedisModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AppleStrategy,
    JwtAuthGuard,
    RefreshTokenGuard,
    EmailService,
    UserEventsPublisher,
  ],
})
export class AuthModule {}

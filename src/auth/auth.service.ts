import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput, RegisterInput, TokensWithId } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../utils/email.service';
import { v4 as uuid } from 'uuid';
import { userClient, createUserMutation } from '../graphql/user.client';
import { UserEventsPublisher } from '../events/user-events.publisher';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private redis: RedisService,
    private email: EmailService,
    private publisher: UserEventsPublisher,
  ) {}

  async register(input: RegisterInput): Promise<TokensWithId> {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userId = uuid();

    // Crear el usuario vía GraphQL en user-service
    await userClient.mutate({
      mutation: createUserMutation,
      variables: {
        input: {
          id: userId,
          email: input.email,
          name: input.name,
          phone: input.phone, // nuevo
          password: hashedPassword, // si user-service lo almacena
        },
      },
    });
    
    const tokens = await this.getTokens(userId, input.email);
    await this.updateRefreshToken(userId, tokens.refresh_token);
    await this.email.sendWelcomeEmail(input.email);

    this.publisher.emitUserRegistered({ id: userId, email: input.email });

    return { ...tokens, userId };
  }

  async login(input: LoginInput): Promise<TokensWithId> {
    // ⚠️ En producción validar con user-service
    const isMatch = input.password === '123456'; // Simulación
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const userId = 'user-id-123';
    const tokens = await this.getTokens(userId, input.email);
    await this.updateRefreshToken(userId, tokens.refresh_token);
    return { ...tokens, userId };
  }

  async logout(userId: string): Promise<boolean> {
    await this.redis.del(`refresh:${userId}`);
    return true;
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<TokensWithId> {
    const stored = await this.redis.get(`refresh:${userId}`);
    if (stored !== refreshToken) throw new UnauthorizedException();
    const tokens = await this.getTokens(userId, 'unknown@example.com');
    await this.updateRefreshToken(userId, tokens.refresh_token);
    return { ...tokens, userId };
  }

  private async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const access_token = this.jwt.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwt.sign(payload, { expiresIn: '7d' });
    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: string, token: string) {
    await this.redis.set(`refresh:${userId}`, token, { EX: 60 * 60 * 24 * 7 });
  }
}

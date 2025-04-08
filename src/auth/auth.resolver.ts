import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput, TokensWithId } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokensWithId)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => TokensWithId)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  async logout(@Context() context) {
    const userId = context.req.user.id;
    return this.authService.logout(userId);
  }

  @Mutation(() => TokensWithId)
  async refreshTokens(@Context() context) {
    const userId = context.req.user.id;
    const refreshToken = context.req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}

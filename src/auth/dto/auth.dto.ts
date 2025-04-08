import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field() email: string;
  @Field() password: string;
}

@InputType()
export class RegisterInput {
  @Field() email: string;
  @Field() password: string;
}

@ObjectType()
export class Tokens {
  @Field() access_token: string;
  @Field() refresh_token: string;
}

@ObjectType()
export class TokensWithId extends Tokens {
  @Field() userId: string;
}

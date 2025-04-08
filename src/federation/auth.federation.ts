import { Directive, Field, ObjectType, ID } from '@nestjs/graphql';


//this allows to extends for user and in the future use anonymous logins
@ObjectType()
@Directive('@key(fields: "id")')
export class AuthUser {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;
}

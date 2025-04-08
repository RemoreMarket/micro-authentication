import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core';
import fetch from 'cross-fetch';

export const userClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.USER_SERVICE_URL || 'http://localhost:3002/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
});

export const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      phone
    }
  }
`;

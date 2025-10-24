import { User } from '@/types/user';
import { gql } from '@apollo/client';

export interface LoginResponse {
  login: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      image?: string;
      username?: string;
      roles: Array<{ name: string }>;
      allPermissions: Array<{ name: string }>;
    };
  };
}

const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    first_name
    last_name
    image
    username
    roles {
      name
    }
    allPermissions {
      name
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const SOCIAL_AUTH_MUTATION = gql`
  mutation SocialAuth($input: SocialAuthInput!) {
    socialAuth(input: $input) {
      accessToken
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export interface SocialAuthResponse {
  socialAuth?: {
    accessToken: string;
    user: User;
  };
}

import { gql } from '@apollo/client';

export const USERS_QUERY = gql`
  query Users($options: UserQueryInput) {
    users(options: $options) {
      total
      items {
        id
        email
        first_name
        last_name
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: String!) {
    user(id: $id) {
      id
      email
      first_name
      last_name
      username
      createdAt
      updatedAt
    }
  }
`;

export const GET_SINGLE_USER_QUERY = gql`
  query GetSingleUser($options: UserQueryInput) {
    user(options: $options) {
      id
      email
      first_name
      last_name
      username
      createdAt
      updatedAt
    }
  }
`;

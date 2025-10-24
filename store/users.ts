import type { User } from '../types/user';
import { createEntity } from './entityFactory';
import {
  USERS_QUERY,
  GET_USER_BY_ID_QUERY,
  GET_SINGLE_USER_QUERY,
} from '@/graphql/queries/users';

export const users = createEntity<User>({
  reducerPath: 'usersApi',
  entityEndpoint: 'users',
  entityName: 'User',
  useGraphQL: true,
  graphqlQueries: {
    getAll: USERS_QUERY,
    getById: GET_USER_BY_ID_QUERY,
    getSingle: GET_SINGLE_USER_QUERY,
  },
});

export const {
  useGetAllQuery: useGetUsersQuery,
  useGetByIdQuery: useGetUserQuery,
  useCreateMutation: useCreateUserMutation,
  useUpdateMutation: useUpdateUserMutation,
  useDeleteMutation: useDeleteUserMutation,
} = users;

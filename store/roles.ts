import type { Role } from '../types/role';
import { createEntity } from './entityFactory';

export const roles = createEntity<Role>({
  reducerPath: 'rolesApi',
  entityEndpoint: 'roles',
  entityName: 'Role',
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation: useCreateRoleMutation,
  useUpdateMutation: useUpdateRoleMutation,
  useDeleteMutation: useDeleteRoleMutation,
} = roles;

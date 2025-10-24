import { Permission } from './permission';
import { Role } from './role';

export interface User {
  id: string;
  first_name: string;
  full_name: string;
  last_name: string;
  email: string;
  phone: string;
  email_verified_at?: string | null;
  roles?: Role[];
  allPermissions: Permission[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

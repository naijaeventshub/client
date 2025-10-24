import { Permission } from './permission';

export interface Role {
  id: string;
  name: string;
  access_type: string;
  description?: string | null;
  permissions?: Permission[];
  permissions_count?: number;
  created_at: string;
  updated_at: string;
}

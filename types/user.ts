import { Role } from "./role";

export interface User {
  id: string;
  uuid: string;
  first_name: string;
  full_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: Role;
  status: string;
  email_verified_at: string | null;
  is_active: boolean;
  created_at: string;
}

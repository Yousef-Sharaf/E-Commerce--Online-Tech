export type Role = 'Admin' | 'Customer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

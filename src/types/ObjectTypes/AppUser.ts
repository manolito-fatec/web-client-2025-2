import type { Role } from '@/types/ObjectTypes/Role.ts'

export interface AppUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  password: string;
  role: Role;
  expiredate?: Date;
  emailVerified: boolean
}

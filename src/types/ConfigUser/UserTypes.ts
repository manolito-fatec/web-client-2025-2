export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: any;
    company?: string;
}

export interface AuditDto {
  event: string;
  user: string;
  date: string;
  locale: string;
  details: string;
}

export interface UserProfileInformation {
  appUser: UserProfile;
  auditInfomation: AuditDto[];
}
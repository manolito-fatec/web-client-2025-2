import type { CheckInRegisterAndUpdate, CheckList } from '@/types/ContractTypes/CheckList.ts'

export interface NewUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  termsId?: number;
  termAccepted?: boolean;
  checkList: CheckInRegisterAndUpdate[];
}

import type { CheckInRegisterAndUpdate, CheckList } from '@/types/ContractTypes/CheckList.ts'

export interface Term {
  "title": string,
  "content": string,
  "checkList": CheckList[]
}

export interface TermHeader {
  "termsId": number,
  "title": string,
  "content": string,
}

export interface TermByUser {
  "userId": number,
  "term": TermHeader,
  "checks": CheckInRegisterAndUpdate[],
}

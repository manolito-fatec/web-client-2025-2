import type { CheckList } from '@/types/ContractTypes/CheckList.ts'

export interface Term {
  "title": string,
  "content": string,
  "checkList": CheckList[]
}

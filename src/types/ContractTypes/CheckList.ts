export interface CheckList{
  "checkId": number,
  "label": string,
  "required": boolean
}

export interface CheckInRegisterAndUpdate{
  "checkId": number,
  "label": string,
  "required"?: boolean,
  "check": boolean
}

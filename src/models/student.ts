import { Class } from './class'

export type Phone = {
  name: string
  number: string
}
export type Student = {
  id: string
  saintName: string
  firstName: string
  lastName: string
  avatarPath?: string
  gender?: boolean
  birthday: string
  grade: string
  address: string
  phones: Phone[]
  class?: Class
  fullName?: string
  isDeleted?: boolean
}

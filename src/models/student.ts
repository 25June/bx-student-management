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
  schoolYears?: string[]
  note?: string
  transferHistory?: string[]
}

export type RegisterStudent = {
  id: string
  saintName: string
  firstName: string
  lastName: string
  avatarPath?: string
  schoolName: string
  gender?: boolean
  birthday: string
  bornIn?: string
  grade: string
  address: string
  shortTermAddress: string
  phones: Phone[]
  class?: Class
  fullName?: string
  isDeleted?: boolean
  schoolYears?: string[]
  note?: string
  parent: {
    fatherName: string
    motherName: string
  }
  baptismDate: string
  baptismChurch: string
  baptismByPriest: string
  eucharistAndReconciliationDate: string
  eucharistAndReconciliationChurch: string
  eucharistAndReconciliationByPriest: string
}

export interface Phone {
  name: string
  number: string
}
export interface Student {
  id: string
  saintName: string
  firstName: string
  lastName: string
  avatar?: string | null
  gender?: boolean
  birthday: string
  grade: string
  address: string
  phones: Phone[]
}

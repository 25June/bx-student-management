export interface Student {
  id: string
  saintName: string
  firstName: string
  middleName: string
  lastName: string
  avatar: string | null
  gender: boolean
  birthday: Date
  grade: string
  address: string
  phone: string[]
  class: { id: string; name: string }
}

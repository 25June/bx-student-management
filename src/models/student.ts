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

export interface Score {
  updatedDate: number
  point: number
}

export interface ScoreBook {
  score5: Record<string, Score>
  score15: Record<string, Score>
  score45: Record<string, Score>
  score60: Record<string, Score>
}

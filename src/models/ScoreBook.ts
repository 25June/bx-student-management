import { Timestamp } from 'firebase/firestore'
import { Student } from 'models/student'

export type Score = {
  updatedDate?: Timestamp
  score: number
  bookDate: string
}

export type ScoreBook = {
  id: string
  score5: Record<string, number>
  score15: Record<string, number>
  score45: Record<string, number>
  score60: Record<string, number>
  updatedDate?: Timestamp
  schoolYear?: string
}

export type StudentScoreBook = Student & ScoreBook

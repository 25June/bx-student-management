import { Timestamp } from 'firebase/firestore'
import { Student } from 'models/student'

export type Score = {
  updatedDate?: Timestamp
  score: number
  bookDate: string
}

export type ScoreBook = {
  id: string
  studentId: string
  score5: Record<string, Score>
  score15: Record<string, Score>
  score45: Record<string, Score>
  score60: Record<string, Score>
  updatedDate?: Timestamp
  // for reporting chart
  schoolYear?: string
}

export type StudentScoreBooks = Student & ScoreBook

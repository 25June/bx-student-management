import { Timestamp } from 'firebase/firestore'

export type Assessment = {
  id: string
  classId: string
  schoolYearId?: string
  bookDate: string
  createdDate?: Timestamp
  lesson: string
  type: string
  isDeleted?: boolean
}

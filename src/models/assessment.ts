import { Timestamp } from 'firebase/firestore'
import { AssessmentEnum } from 'constant/common'

export type Assessment = {
  id: string
  classId: string
  schoolYearId?: string
  bookDate: string
  createdDate?: Timestamp
  lesson: string
  type: AssessmentEnum
  isDeleted?: boolean
  schoolYear: string
  documents?: Document[]
}

export type Document = {
  path: string
  name: string
}

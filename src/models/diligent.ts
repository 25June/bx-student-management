export interface StudentDiligent {
  studentId: Record<string, boolean>
}

export interface ClassDiligent {
  class: string
  semester: string
  session: string
  studyDates: string[]
}

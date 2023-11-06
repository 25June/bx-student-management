export interface StudentDiligent {
  studentId: Record<string, boolean>
}

export interface AttendanceProps {
  tl: boolean
  gl: boolean
  note?: string
  givingNotice?: boolean
  adoration?: boolean
}

export interface OnSubmitAttendanceProps {
  value: boolean
  rollCallKey: string
  isMissal: boolean
}

export interface NoteForm {
  givingNotice: boolean
  adoration: boolean
  note: string
}

export interface RollCallDate {
  key: string
  dateAsString: string
  dateAsNumber: number
  month: string
}

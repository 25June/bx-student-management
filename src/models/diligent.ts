export interface StudentDiligent {
  studentId: Record<string, boolean>
}

export interface AttendanceProps {
  tl: boolean
  gl: boolean
  note?: string
}

export interface OnSubmitAttendanceProps {
  value: boolean
  rollCallKey: string
  isMissal: boolean
}

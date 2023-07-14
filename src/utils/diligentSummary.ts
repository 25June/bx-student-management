import { Attendances } from 'services/diligent'

export interface CountStudentPresentResponse {
  tl: number
  gl: number
}

export const countStudentPresent = (
  rollCallDate: string,
  attendances: Attendances
): CountStudentPresentResponse => {
  let tl = 0
  let gl = 0
  Object.keys(attendances).forEach((studentId: string) => {
    if (attendances[studentId]) {
      const attendanceOfStudent = attendances[studentId][rollCallDate]
      if (attendanceOfStudent) {
        if (attendanceOfStudent.tl) {
          tl += 1
        }
        if (attendanceOfStudent.gl) {
          gl += 1
        }
      }
    }
  })
  return { tl, gl }
}

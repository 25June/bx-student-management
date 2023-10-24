import { Student } from 'models/student'
import { Attendances } from 'services/diligent'

export interface CountStudentPresentResponse {
  tl: number
  gl: number
}

export const countStudentPresent = (
  rollCallDate: string,
  attendances: Attendances,
  students: Student[]
): CountStudentPresentResponse => {
  let tl = 0
  let gl = 0
  students.forEach(({ id }) => {
    if (attendances[id]) {
      const attendanceOfStudent = attendances[id][rollCallDate]
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

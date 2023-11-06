import { RollCallDate } from 'models/diligent'
import { Attendances } from 'services/diligent'
import { Student } from 'models/student'
import { OverviewReport } from 'models/report'
import { get } from 'lodash'

export const countStudentPresentPerDate = (
  date: RollCallDate,
  attendance: Attendances,
  students: Student[]
): OverviewReport => {
  const defaultValue = {
    tl: 0,
    gl: 0,
    note: 0,
  }
  if (attendance) {
    const statistic = students.reduce((acc, student) => {
      const data = get(attendance, [student.id, date.key], null)
      if (data) {
        return {
          tl: data.tl ? acc.tl + 1 : acc.tl,
          gl: data.gl ? acc.gl + 1 : acc.gl,
          note: data.note ? acc.note + 1 : acc.note,
        }
      }
      return acc
    }, defaultValue)
    return { ...statistic, date, total: students.length }
  }
  return { ...defaultValue, date, total: students.length }
}

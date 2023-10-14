import { RollCallDate } from 'utils/customHooks'

export interface MonthlyDiligentReport {
  gl: number
  tl: number
  note: number
  date: RollCallDate
  total: number
}

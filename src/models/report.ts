import { RollCallDate } from 'models/diligent'

export interface OverviewReport {
  gl: number
  tl: number
  note: number
  date: RollCallDate
  total: number
}

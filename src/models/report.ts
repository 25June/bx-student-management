import { RollCallDate } from 'utils/customHooks'

export interface OverviewReport {
  gl: number
  tl: number
  note: number
  date: RollCallDate
  total: number
}

import { Box } from '@mui/material'
import { useDiligentContext } from 'contexts/DiligentContext'
import { useEffect, useState } from 'react'
import { useClassContext } from 'contexts/ClassContext'
import { get, sortBy } from 'lodash'
import { groupRollCallToSortedMonths, RollCallDate } from 'utils/customHooks'
import MonthlyDiligentDisplay from './MonthlyDiligentDisplay.component'
import { useStudentContext } from 'contexts/StudentContext'
import { MonthlyDiligentReport } from 'models/report'

const MonthlyReportComponent = () => {
  const { rollCallDates, fetchRollCallDates, attendances } = useDiligentContext()
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { students } = useStudentContext()
  const [groupRollDate, setGroupRollDate] = useState<Record<string, RollCallDate[]>>({})

  useEffect(() => {
    fetchRollCallDates?.({ classId, semesterId, schoolYearId })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (rollCallDates) {
      const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)
      setGroupRollDate(sortedMonthDate)
    }
  }, [rollCallDates])

  const countStudentPresentPerDate = (date: RollCallDate): MonthlyDiligentReport => {
    const defaultValue = {
      tl: 0,
      gl: 0,
      note: 0,
    }
    if (attendances) {
      const statistic = Object.keys(attendances).reduce((acc, cur) => {
        const data = get(attendances, [cur, date.key], null)
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

  return (
    <Box sx={{ marginTop: '1rem' }}>
      Tổng kết Các Ngày Điểm Danh
      {groupRollDate &&
        sortBy(Object.keys(groupRollDate)).map((key) => {
          const month = sortBy(groupRollDate[key], 'dateAsNumber').map((date) => {
            return countStudentPresentPerDate(date)
          })
          return <MonthlyDiligentDisplay key={key} data={month} />
        })}
    </Box>
  )
}

export default MonthlyReportComponent

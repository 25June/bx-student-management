import { Box } from '@mui/material'
import { useDiligentContext } from 'contexts/DiligentContext'
import { useEffect, useMemo } from 'react'
import { useClassContext } from 'contexts/ClassContext'
import { flatMap, get, sortBy, isEmpty } from 'lodash'
import { groupRollCallToSortedMonths, RollCallDate } from 'utils/customHooks'
import DiligentReport from './DiligentReport.component'
import { useStudentContext } from 'contexts/StudentContext'
import { OverviewReport } from 'models/report'
import { KeyValueProp } from 'models/common'
import { Attendances } from 'services/diligent'

interface Props {
  onViewDetail: (date: KeyValueProp, month: string) => void
}

const OverviewReportComponent = ({ onViewDetail }: Props) => {
  const { rollCallDates, fetchRollCallDates, attendances } = useDiligentContext()
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { students } = useStudentContext()

  useEffect(() => {
    fetchRollCallDates?.({ classId, semesterId, schoolYearId })
    // eslint-disable-next-line
  }, [])

  const countStudentPresentPerDate = (
    date: RollCallDate,
    attendance: Attendances
  ): OverviewReport => {
    const defaultValue = {
      tl: 0,
      gl: 0,
      note: 0,
    }
    if (attendance) {
      const statistic = Object.keys(attendance).reduce((acc, cur) => {
        const data = get(attendance, [cur, date.key], null)
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

  const groupDate = useMemo(() => {
    if (!isEmpty(rollCallDates) && !isEmpty(attendances)) {
      const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)

      const sortedGroupDate = sortBy(flatMap(Object.values(sortedMonthDate)), ['dateAsNumber']).map(
        (date) => {
          return countStudentPresentPerDate(date, attendances)
        }
      )
      return sortedGroupDate
    }
    return []
    // eslint-disable-next-line
  }, [rollCallDates, attendances])

  return (
    <Box sx={{ marginTop: '1rem' }}>
      Tổng kết Các Ngày Điểm Danh
      {groupDate && <DiligentReport data={groupDate} onViewDetail={onViewDetail} />}
    </Box>
  )
}

export default OverviewReportComponent

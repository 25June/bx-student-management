import { Box } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { flatMap, orderBy, isEmpty } from 'lodash'
import { useDiligentContext } from 'contexts/DiligentContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { groupRollCallToSortedMonths } from 'utils/customHooks'
import DiligentReport from './DiligentReport.component'
import { KeyValueProp } from 'models/common'
import { countStudentPresentPerDate } from 'utils/report'

interface Props {
  onViewDetail: (date: KeyValueProp, month: string) => void
  openDiligentDialog: (date: string, id: string) => void
}

const OverviewReportComponent = ({ onViewDetail, openDiligentDialog }: Props) => {
  const { rollCallDates, fetchRollCallDates, attendances } = useDiligentContext()
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { students } = useStudentContext()

  useEffect(() => {
    if (classId && semesterId && schoolYearId && fetchRollCallDates) {
      fetchRollCallDates({ classId, semesterId, schoolYearId })
    }
  }, [classId, semesterId, schoolYearId, fetchRollCallDates])

  const groupDate = useMemo(() => {
    if (!isEmpty(rollCallDates)) {
      const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)

      const sortedGroupDate = orderBy(
        flatMap(Object.values(sortedMonthDate)),
        ['dateAsNumber'],
        ['desc']
      ).map((date) => {
        return countStudentPresentPerDate(date, attendances || {}, students)
      })
      return sortedGroupDate
    }
    return []
    // eslint-disable-next-line
  }, [rollCallDates, attendances, students])
  return (
    <Box sx={{ marginTop: '1rem' }}>
      {groupDate.length !== 0 && (
        <DiligentReport
          data={groupDate}
          onViewDetail={onViewDetail}
          openDiligentDialog={openDiligentDialog}
        />
      )}
    </Box>
  )
}

export default OverviewReportComponent

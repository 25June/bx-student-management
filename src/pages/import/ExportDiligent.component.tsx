import { Box, Typography, Button } from '@mui/material'
import { amber, lightGreen } from '@mui/material/colors'
import writeXlsxFile from 'write-excel-file'
import { Class } from 'models/class'
import { Student } from 'models/student'
import { RollCallDate } from 'models/diligent'
import { DILIGENT_BANNER_ROW, DILIGENT_PREPARE_ROW, DILIGENT_HEADER_ROW } from 'constant/export'
import { useDiligentContext } from 'contexts/DiligentContext'
import { useClassContext } from 'contexts/ClassContext'
import { useEffect, useMemo } from 'react'
import { get, isEmpty, sortBy } from 'lodash'
import { groupRollCallToSortedMonths } from 'utils/customHooks'
import { useStudentContext } from 'contexts/StudentContext'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'

interface Props {
  currentClass: Class
}
const ExportDiligentComponent = ({ currentClass }: Props) => {
  const { rollCallDates, fetchRollCallDates, attendances } = useDiligentContext()
  const { semesterId, schoolYearId } = useClassContext()
  const { students } = useStudentContext()
  useEffect(() => {
    if (currentClass && fetchRollCallDates) {
      fetchRollCallDates({ classId: currentClass.id, semesterId, schoolYearId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClass])

  const groupedMonth: Record<string, RollCallDate[]> | null = useMemo(() => {
    if (!isEmpty(rollCallDates)) {
      const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)
      Object.keys(sortedMonthDate).forEach((key) => {
        sortedMonthDate[key] = sortBy(sortedMonthDate[key], 'dateAsNumber')
      })
      return sortedMonthDate
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollCallDates, attendances, students])

  const exportDate = async () => {
    if (students.length === 0) {
      return
    }
    const sortedStudent = students.sort((a, b) => a.firstName.localeCompare(b.firstName))
    if (groupedMonth === null || !attendances) {
      return
    }
    const dates = Object.keys(groupedMonth)
      .map((keyMonth: string) => {
        return groupedMonth[keyMonth].map((date: RollCallDate) => {
          return {
            key: date.key,
            text: formatYYYMMDDToDDMMYYYY(date.dateAsString),
          }
        })
      })
      .flat()

    const DATA_ROWS = sortedStudent.map((stu: Student, index) => {
      return [
        {
          alignVertical: 'top',
          type: Number,
          value: index + 1,
          align: 'center',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.saintName || '',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.lastName,
          leftBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.firstName,
          fontWeight: 'bold',
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
        },
        ...dates
          .map(({ key }: { key: string; text: string }) => {
            const tl = get(attendances, [stu.id, key, 'tl'])
            const gl = get(attendances, [stu.id, key, 'gl'])
            const note = get(attendances, [stu.id, key, 'note'])
            return [
              {
                alignVertical: 'top',
                align: 'center',
                type: String,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: tl ? 'x' : '',
                backgroundColor: tl ? '' : amber[200],
              },
              {
                alignVertical: 'top',
                align: 'center',
                type: String,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: gl ? 'x' : '',
                backgroundColor: tl ? '' : amber[200],
              },
              {
                alignVertical: 'top',
                wrap: true,
                type: String,
                rightBorderStyle: 'thin',
                topBorderStyle: 'thin',
                bottomBorderStyle: 'thin',
                value: note || '',
                backgroundColor: note ? lightGreen[200] : '',
              },
            ]
          })
          .flat(),
      ]
    })

    const COLUMNS = [
      {
        width: 5,
      },
      {
        width: 10,
      },
      {
        width: 20,
      },
      {
        width: 8,
      },
      ...dates
        .map((d) => {
          return [
            {
              width: 5,
            },
            {
              width: 5,
            },
            {
              width: 20,
            },
          ]
        })
        .flat(),
    ]
    const data = [
      DILIGENT_BANNER_ROW(dates.map((date) => date.text)),
      DILIGENT_PREPARE_ROW(
        currentClass.id,
        dates.map((date) => date.text)
      ),
      ...DILIGENT_HEADER_ROW(dates.map((date) => date.text)),
      ...DATA_ROWS,
    ]
    await writeXlsxFile(data as any, {
      columns: COLUMNS,
      fileName: `Chuyen Can ${currentClass?.name || 'file'}.xlsx`,
      fontFamily: 'Times New Roman',
      fontSize: 13,
      orientation: 'landscape',
    })
  }
  return (
    <Box>
      <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
        Xuất Thông Tin Chuyên Cần
      </Typography>
      <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
        Lớp {currentClass?.name}
      </Typography>
      <Button onClick={exportDate} variant={'contained'}>
        Xuất file excel
      </Button>
    </Box>
  )
}

export default ExportDiligentComponent

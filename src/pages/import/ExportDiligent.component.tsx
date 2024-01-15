import { Box, Typography, Button } from '@mui/material'
import { amber, lightGreen } from '@mui/material/colors'
import writeXlsxFile from 'write-excel-file'
import { Class } from 'models/class'
import { Student } from 'models/student'
import { RollCallDate } from 'models/diligent'
import {
  DILIGENT_BANNER_ROW,
  DILIGENT_PREPARE_ROW,
  DILIGENT_HEADER_ROW,
  DILIGENT_COLUMNS_WIDTH,
} from 'constant/export/diligent'
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

    const SUM_DATA_ROWS = sortedStudent.map((stu: Student, index) => {
      const attendance = get(attendances, stu.id, null)
      const summaryData = attendance
        ? Object.keys(attendance).reduce(
            (acc, cur) => {
              return {
                gl: attendance[cur]?.gl ? acc.gl + 1 : acc.gl,
                tl: attendance[cur]?.tl ? acc.tl + 1 : acc.tl,
                givingNotice: attendance[cur]?.givingNotice
                  ? acc.givingNotice + 1
                  : acc.givingNotice,
                adoration: attendance[cur]?.adoration ? acc.adoration + 1 : acc.adoration,
              }
            },
            { gl: 0, tl: 0, givingNotice: 0, adoration: 0 } as Record<string, number>
          )
        : { gl: 0, tl: 0, givingNotice: 0, adoration: 0 }
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
        {
          alignVertical: 'top',
          align: 'center',
          type: String,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: summaryData.tl.toString(),
        },
        {
          alignVertical: 'top',
          align: 'center',
          type: String,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: summaryData.gl.toString(),
        },
        {
          alignVertical: 'top',
          wrap: true,
          type: String,
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          value: `${summaryData.givingNotice} Phép`,
        },
      ]
    })
    const summary = {
      sheetName: 'Tổng kết',
      sheetValue: [
        DILIGENT_BANNER_ROW(['Tổng kết']),
        DILIGENT_PREPARE_ROW(currentClass, ['Tổng kết']),
        ...DILIGENT_HEADER_ROW(['Tổng kết']),
        ...SUM_DATA_ROWS,
      ],
      column: DILIGENT_COLUMNS_WIDTH(['Tổng kết']),
    }

    const dataForEachMonth = Object.values(groupedMonth)
      .sort((a, b) => (a?.[0]?.month < b?.[0]?.month ? 1 : -1))
      .reduce((acc, rollCallDates: RollCallDate[]) => {
        const dates = rollCallDates.map((date: RollCallDate) => {
          return {
            key: date.key,
            text: formatYYYMMDDToDDMMYYYY(date.dateAsString),
          }
        })
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
                const givingNotice = get(attendances, [stu.id, key, 'givingNotice'], false)
                const adoration = get(attendances, [stu.id, key, 'adoration'], false)
                let finalNode = givingNotice ? 'Vắng có phép' : ''
                if (note) {
                  finalNode += ` - ${note}`
                }
                if (adoration) {
                  finalNode += ` - Có chầu thánh thể`
                }
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
                    backgroundColor: gl ? '' : amber[200],
                  },
                  {
                    alignVertical: 'top',
                    wrap: true,
                    type: String,
                    rightBorderStyle: 'thin',
                    topBorderStyle: 'thin',
                    bottomBorderStyle: 'thin',
                    value: finalNode,
                    backgroundColor: finalNode ? lightGreen[200] : '',
                  },
                ]
              })
              .flat(),
          ]
        })
        const data: any[] = [
          DILIGENT_BANNER_ROW(dates.map((date) => date.text)),
          DILIGENT_PREPARE_ROW(
            currentClass,
            dates.map((date) => date.text)
          ),
          ...DILIGENT_HEADER_ROW(dates.map((date) => date.text)),
          ...DATA_ROWS,
        ]

        return acc.concat({
          sheetName: rollCallDates[0].month,
          sheetValue: data,
          column: DILIGENT_COLUMNS_WIDTH(dates.map((date) => date.text)),
        })
      }, [] as { sheetName: string; sheetValue: any; column: any[] }[])

    dataForEachMonth.push(summary)
    await writeXlsxFile(
      dataForEachMonth.map((month) => month.sheetValue),
      {
        columns: dataForEachMonth.map((month) => month.column),
        sheets: dataForEachMonth.map((month) => month.sheetName.replaceAll('/', '.')),
        fileName: `Chuyen Can ${currentClass?.name || 'file'}.xlsx`,
        fontFamily: 'Times New Roman',
        fontSize: 13,
        orientation: 'landscape',
      }
    )
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

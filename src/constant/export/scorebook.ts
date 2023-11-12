import { format } from 'date-fns'
import { Class } from 'models/class'
import { formatDisplayDDMM } from 'utils/datetime'

export const SCOREBOOK_BANNER_ROW = (assessmentDates: string[]) => {
  const colNumber = assessmentDates.length === 1 ? 2 : assessmentDates.length
  const emptyArr = Array.from(new Array(colNumber - 1)).map(() => null)

  return [
    {
      value: `Ban Giáo Lý Thiếu Nhi`,
      fontWeight: 'bold',
      span: 3,
      align: 'center',
      wrap: true,
    },
    null,
    null,
    {
      value: `Danh Sách Thiếu Nhi Giáo Lý`,
      fontWeight: 'bold',
      span: colNumber - 1,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
    ...emptyArr,
    {
      value: `Cập nhật ngày ${format(new Date(), 'dd/MM/yyyy')}`,
      rowSpan: 2,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
  ]
}

export const SCOREBOOK_PREPARE_ROW = (currentClass: Class, assessmentDates: string[]) => {
  const colNumber = assessmentDates.length === 1 ? 2 : assessmentDates.length
  const emptyArr = Array.from(new Array(colNumber - 1)).map(() => null)
  return [
    {
      value: `Lớp ${currentClass?.name}`,
      fontWeight: 'bold',
      span: 3,
      align: 'center',
      wrap: true,
    },
    null,
    null,
    {
      value: `Niên Khoá 2023-2024`,
      fontWeight: 'bold',
      span: colNumber - 1,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
    ...emptyArr,
    null,
    null,
  ]
}

export const SCOREBOOK_HEADER_ROW = ({
  score5,
  score15,
  score45,
  score60,
}: {
  score5: string[]
  score15: string[]
  score45: string[]
  score60: string[]
}) => {
  const assessments = [score5, score15, score45, score60]
  const { dateCols, itemCols } = ['KT5', 'KT15', 'KT45', 'KT60'].reduce<any>(
    (acc, cur, index) => {
      if (assessments[index].length === 0) {
        return acc
      }
      const dateCol = [
        {
          value: cur,
          fontWeight: 'bold',
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          align: 'center',
          span: assessments[index].length,
        },
        ...Array.from(new Array(assessments[index].length - 1)).map(() => null),
      ]
      const itemCol = assessments[index].map((date: string) => {
        return {
          value: formatDisplayDDMM(date),
          fontWeight: 'bold',
          rightBorderStyle: 'thin',
          topBorderStyle: 'thin',
          bottomBorderStyle: 'thin',
          align: 'center',
        }
      })
      return {
        dateCols: acc.dateCols.concat(...dateCol),
        itemCols: acc.itemCols.concat(...itemCol),
      }
    },
    { dateCols: [], itemCols: [] }
  )

  const firstRow = [
    {
      value: 'STT',
      fontWeight: 'bold',
      borderStyle: 'thin',
      align: 'center',
      rowSpan: 2,
    },
    {
      value: 'Tên Thánh',
      fontWeight: 'bold',
      borderStyle: 'thin',
      align: 'center',
      rowSpan: 2,
    },
    {
      value: 'Họ và',
      fontWeight: 'bold',
      leftBorderStyle: 'thin',
      topBorderStyle: 'thin',
      bottomBorderStyle: 'thin',
      align: 'center',
      rowSpan: 2,
    },
    {
      value: 'Tên',
      fontWeight: 'bold',
      rightBorderStyle: 'thin',
      topBorderStyle: 'thin',
      bottomBorderStyle: 'thin',
      align: 'center',
      rowSpan: 2,
    },
    ...dateCols,
  ]
  const secondRow = [null, null, null, null, ...itemCols]
  return [firstRow, secondRow]
}

export const SCOREBOOK_COLUMNS_WIDTH = (assessmentDates: string[]) => {
  return [
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
    ...assessmentDates.map((date) => {
      return {
        width: 10,
      }
    }),
  ]
}

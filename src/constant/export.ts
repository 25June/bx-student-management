import { format } from 'date-fns'

export const DILIGENT_BANNER_ROW = (dates: string[]) => {
  const colNumber = dates.length === 1 ? 2 : dates.length * 3 - 1
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
      span: colNumber,
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
      span: 2,
    },
    null,
  ]
}

export const DILIGENT_PREPARE_ROW = (className: string, dates: string[]) => {
  const colNumber = dates.length === 1 ? 2 : dates.length * 3 - 1

  const emptyArr = Array.from(new Array(colNumber - 1)).map(() => null)
  return [
    {
      value: `Lớp ${className}`,
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
      span: colNumber,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
    ...emptyArr,
    null,
    null,
  ]
}

export const DILIGENT_HEADER_ROW = (dates: string[]) => {
  const { dateCol, itemCol } = dates.reduce<any>(
    (acc, currentDate) => {
      return {
        dateCol: acc.dateCol.concat(
          {
            value: currentDate,
            fontWeight: 'bold',
            rightBorderStyle: 'thin',
            topBorderStyle: 'thin',
            bottomBorderStyle: 'thin',
            align: 'center',
            span: 3,
          },
          null,
          null
        ),
        itemCol: acc.itemCol.concat(
          {
            value: 'TL',
            fontWeight: 'bold',
            rightBorderStyle: 'thin',
            topBorderStyle: 'thin',
            bottomBorderStyle: 'thin',
            align: 'center',
          },
          {
            value: 'GL',
            fontWeight: 'bold',
            rightBorderStyle: 'thin',
            topBorderStyle: 'thin',
            bottomBorderStyle: 'thin',
            align: 'center',
          },
          {
            value: 'Ghi Chu',
            fontWeight: 'bold',
            rightBorderStyle: 'thin',
            topBorderStyle: 'thin',
            bottomBorderStyle: 'thin',
            align: 'center',
          }
        ),
      }
    },
    {
      dateCol: [],
      itemCol: [],
    }
  )
  console.log({ dateCol, itemCol })
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
    ...dateCol,
  ]
  const secondRow = [null, null, null, null, ...itemCol]
  return [firstRow, secondRow]
}

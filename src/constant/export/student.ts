import { format } from 'date-fns'
import { Class } from 'models/class'

export const STUDENT_BANNER_ROW = () => {
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
      span: 5,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
    null,
    null,
    null,
    null,
    {
      value: `Cập nhật ngày ${format(new Date(), 'dd/MM/yyyy')}`,
      rowSpan: 2,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
  ]
}

export const STUDENT_HEADER_ROW = () => {
  return [
    {
      value: 'STT',
      fontWeight: 'bold',
      borderStyle: 'thin',
      align: 'center',
    },
    {
      value: 'Tên Thánh',
      fontWeight: 'bold',
      borderStyle: 'thin',
      align: 'center',
    },
    {
      value: 'Họ và',
      fontWeight: 'bold',
      leftBorderStyle: 'thin',
      topBorderStyle: 'thin',
      bottomBorderStyle: 'thin',
      align: 'center',
    },
    {
      value: 'Tên',
      fontWeight: 'bold',
      rightBorderStyle: 'thin',
      topBorderStyle: 'thin',
      bottomBorderStyle: 'thin',
      align: 'center',
    },
    {
      value: 'Ngày Sinh',
      fontWeight: 'bold',
      align: 'center',
      borderStyle: 'thin',
    },
    {
      value: 'Địa Chỉ',
      fontWeight: 'bold',
      align: 'center',
      borderStyle: 'thin',
    },
    {
      value: 'VH',
      fontWeight: 'bold',
      align: 'center',
      borderStyle: 'thin',
    },
    {
      value: 'Điện Thoại 1',
      fontWeight: 'bold',
      align: 'center',
      borderStyle: 'thin',
    },
    {
      value: 'Điện Thoại 2',
      fontWeight: 'bold',
      align: 'center',
      borderStyle: 'thin',
    },
  ]
}

export const STUDENT_PREPARE_ROW = (currentClass: Class) => {
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
      span: 5,
      align: 'center',
      alignVertical: 'center',
      wrap: true,
    },
    null,
    null,
    null,
    null,
    null,
  ]
}

export const STUDENT_COLUMNS = () => {
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
    {
      width: 12,
    },
    {
      width: 40,
    },
    {
      width: 7,
    },
    {
      width: 15,
    },
    {
      width: 15,
    },
  ]
}

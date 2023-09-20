import { Box, Typography, Button } from '@mui/material'
import writeXlsxFile from 'write-excel-file'
import { format } from 'date-fns'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { getStudentByClassId } from 'services/student'
import { Class } from 'models'

interface Props {
  currentClass: Class
}

const ExportComponent = ({ currentClass }: Props) => {
  const exportDate = async () => {
    const BANNER_ROW = [
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
    const PREPARE_ROW = [
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
    const HEADER_ROW = [
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
    const students = await getStudentByClassId(currentClass?.id || '')
    const DATA_ROWS = students.map((stu, index) => {
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
          type: String,
          value: stu.birthday ? formatYYYMMDDToDDMMYYYY(stu.birthday) : stu.birthday,
          borderStyle: 'thin',
          align: 'center',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.address || '',
          wrap: true,
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.grade?.toString() || '',
          align: 'center',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.phones[0] ? stu.phones[0].number : '',
          align: 'center',
          borderStyle: 'thin',
        },
        {
          alignVertical: 'top',
          type: String,
          value: stu.phones[1] ? stu.phones[1].number : '',
          align: 'center',
          borderStyle: 'thin',
        },
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
    const data = [BANNER_ROW, PREPARE_ROW, HEADER_ROW, ...DATA_ROWS]
    await writeXlsxFile(data as any, {
      columns: COLUMNS,
      fileName: `${currentClass?.name || 'file'}.xlsx`,
      fontFamily: 'Times New Roman',
      fontSize: 13,
      orientation: 'landscape',
    })
  }
  return (
    <Box sx={{ textAlign: 'left', padding: 1 }}>
      <Typography fontSize={'1rem'} fontWeight={400} sx={{ marginBottom: 1 }}>
        Xuất Thông Tin Thiếu Nhi
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

export default ExportComponent

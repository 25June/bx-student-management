import { Box, Typography, Button } from '@mui/material'
import writeXlsxFile from 'write-excel-file'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { getStudentByClassId } from 'services/student'
import { Class } from 'models/class'
import {
  STUDENT_BANNER_ROW,
  STUDENT_PREPARE_ROW,
  STUDENT_HEADER_ROW,
  STUDENT_COLUMNS,
} from 'constant/export/student'
interface Props {
  currentClass: Class
}

const ExportStudentComponent = ({ currentClass }: Props) => {
  const exportDate = async () => {
    const students = await getStudentByClassId(currentClass?.id || '')
    const sortedStudent = students.sort((a, b) => a.firstName.localeCompare(b.firstName))

    const DATA_ROWS = sortedStudent.map((stu, index) => {
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

    const data = [
      STUDENT_BANNER_ROW(),
      STUDENT_PREPARE_ROW(currentClass),
      STUDENT_HEADER_ROW(),
      ...DATA_ROWS,
    ]
    await writeXlsxFile(data as any, {
      columns: STUDENT_COLUMNS(),
      fileName: `${currentClass?.name || 'file'}.xlsx`,
      fontFamily: 'Times New Roman',
      fontSize: 13,
      orientation: 'landscape',
    })
  }
  return (
    <Box sx={{ textAlign: 'left', padding: 1 }}>
      <Typography fontSize={'1rem'} fontWeight={500} sx={{ marginBottom: 2 }}>
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

export default ExportStudentComponent

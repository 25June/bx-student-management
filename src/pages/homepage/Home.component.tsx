import React, { useState, useCallback } from 'react'
import { Button, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { GridColDef } from '@mui/x-data-grid'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TableComponent from '../../modules/Table/Table.component'
import { students as MockStudents } from '../../mockData/students'
import StudentDialogComponent from '../../modules/student-dialog/StudentDialog.component'
import CardComponent from '../../modules/card/Card.component'
import { StudentActionType } from '../../constant/common'
import Snackbar from '@mui/material/Snackbar'
// import { Student } from '../../models/student'
import Alert from '@mui/material/Alert'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

const columns: GridColDef[] = [
  { field: 'saintName', headerName: 'Tên Thánh' },
  { field: 'lastName', headerName: 'Họ' },
  { field: 'firstName', headerName: 'Tên' },
  { field: 'birthday', headerName: 'Ngày Sinh' },
  { field: 'address', headerName: 'Địa Chỉ' },
  { field: 'grade', headerName: 'Văn Hoá' },
  { field: 'phone1', headerName: 'Điện Thoại Mẹ' },
  { field: 'phone2', headerName: 'Điện Thoại Cha' },
]

const mockDataFormatFirstName = (firstName: string): string => {
  const name = firstName.toLowerCase()
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const mockDataFormatBirthday = (birthday: string): string => {
  if (birthday) {
    const splitBirthday = birthday.split('.')
    return `${splitBirthday[2]}-${splitBirthday[1]}-${splitBirthday[0]}`
  }
  return ''
}

const mockDataFormatPhone = (phone: string): string => (phone ? phone.replaceAll('.', '') : '')

const formatMockData = () => {
  return MockStudents.map((student: any, index: number) => {
    return {
      ...student,
      firstName: mockDataFormatFirstName(student.firstName),
      birthday: mockDataFormatBirthday(student.birthday),
      phone1: mockDataFormatPhone(student.phone1),
      phone2: mockDataFormatPhone(student.phone2),
      id: `student-${index}`,
    }
  })
}

const formatDate = (date: string): string => {
  // format yyyy-MM-dd
  if (date) {
    const splitDate = date.split('-')
    return `${splitDate[2]}.${splitDate[1]}.${splitDate[0]}`
  }
  return ''
}

const formatPhone = (phone: string): string => {
  if (phone) {
    const splitNumber = phone.split('')
    splitNumber[3] = splitNumber[3] + '.'
    splitNumber[6] = splitNumber[6] + '.'
    return splitNumber.join('')
  }
  return ''
}

const formatFullName = (fullName: string) => {
  const lastBlankSpace = fullName.lastIndexOf(' ')
  const firstName = fullName.slice(lastBlankSpace).trim()
  const lastName = fullName.slice(0, lastBlankSpace).trim()
  return { firstName, lastName }
}

const formatStudentTable = (students: any[]) => {
  return students
    .map((student: any) => ({
      ...student,
      firstName: student.firstName.toUpperCase(),
      birthday: formatDate(student.birthday),
      phone1: formatPhone(student.phone1),
      phone2: formatPhone(student.phone2),
    }))
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
}

const HomeComponent = () => {
  const classes = useStyles()
  const [students, setStudents] = useState(formatMockData())
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)
  const [isOpenSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackBarMessage, setSnackBarMessage] = useState<string>('')
  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState({})

  const [displayType, setDisplayType] = React.useState<string | null>('card')

  const handleChangeDisplay = (
    event: React.MouseEvent<HTMLElement>,
    newDisplayType: string | null
  ) => {
    setDisplayType(newDisplayType)
  }

  const openStudentDialog = (type: string): void => {
    setActionType(type)
    setOpenStudentDialog(true)
  }

  const closeStudentDialog = (): void => {
    setOpenStudentDialog(false)
    setTimeout(() => {
      setActionType('')
      setActionData({})
    }, 0)
  }

  const openSnackBar = (message: string) => {
    setSnackBarMessage(message)
    setOpenSnackbar(true)
  }

  const handleClickAction = (data: any, type: string) => {
    setActionData(students.find((student: any) => student.id === data.id))
    openStudentDialog(type)
  }

  const handleSave = (data: any) => {
    switch (actionType) {
      case StudentActionType.ADD_NEW_STUDENT:
        setStudents(
          students
            .concat({
              ...data,
              id: students.length,
              ...formatFullName(data.fullName),
              fullName: undefined,
            })
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
        )
        openSnackBar(`Thêm Thiếu Nhi ${data.fullName} Thành Công`)
        break
      case StudentActionType.EDIT_STUDENT:
        setStudents(
          students.map((student: any) => {
            if (student.id === data.id) {
              return {
                ...data,
                ...formatFullName(data.fullName),
              }
            }
            return student
          })
        )
        openSnackBar(`Cập Nhật Thiếu Nhi ${data.fullName} Thành Công`)
        break
      case StudentActionType.DELETE_STUDENT:
        setStudents(students.filter((student: any) => student.id !== data.id))
        openSnackBar(
          `Xoá Thiếu Nhi ${data.fullName || data.lastName + ' ' + data.firstName} Thành Công`
        )
        break
      default:
        console.log('can not match action type ' + actionType)
        break
    }
  }
  console.log(students)
  return (
    <div className={classes.home}>
      <Box className={classes.title}>
        <h1>Thông Tin Thiếu Nhi</h1>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={useCallback(() => openStudentDialog(StudentActionType.ADD_NEW_STUDENT), [])}
        >
          Thêm Thiếu Nhi
        </Button>
      </Box>
      <Box className={classes.toggle}>
        <ToggleButtonGroup
          value={displayType}
          exclusive={true}
          onChange={handleChangeDisplay}
          aria-label="toggle-display"
        >
          <ToggleButton value="table" aria-label="display-table" size="small">
            <TableRowsIcon />
          </ToggleButton>
          <ToggleButton value="card" aria-label="display-card" size="small">
            <StyleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {displayType === 'table' ? (
        <TableComponent
          columns={columns}
          rows={formatStudentTable(students)}
          onClickAction={handleClickAction}
        />
      ) : (
        <Box className={classes.cards}>
          {students.map((student: any) => (
            <Box mb={4} ml={1} mr={1} key={student.id}>
              <CardComponent student={student} onClickAction={handleClickAction} />
            </Box>
          ))}
        </Box>
      )}
      <StudentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={() => closeStudentDialog()}
        actionType={actionType}
        actionData={actionData}
        onSave={handleSave}
      />
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

const useStyles = makeStyles({
  home: {
    width: '100%',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cards: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    margin: 1,
  },
})
export default HomeComponent

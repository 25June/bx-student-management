import React, { useState, useCallback } from 'react'
import { Button, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { GridColDef } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import TableComponent from '../../modules/Table/Table.component'
// import { Student } from '../../models/student'
import { students as MockStudents } from '../../mockData/students'
import StudentDialogComponent from '../../modules/student-dialog/StudentDialog.component'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Id' },
  { field: 'saintName', headerName: 'Saint name' },
  { field: 'lastName', headerName: 'Last name' },
  { field: 'firstName', headerName: 'First name' },
  { field: 'birthday', headerName: 'Birthday' },
  { field: 'address', headerName: 'Address' },
  { field: 'grade', headerName: 'Grade' },
  { field: 'phone1', headerName: 'Mother phone' },
  { field: 'phone2', headerName: 'Father phone' },
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
  const firstName = fullName.slice(lastBlankSpace)
  const lastName = fullName.slice(0, lastBlankSpace)
  return { firstName, lastName }
}

const formatStudentTable = (students: any[]) => {
  return students.map((student: any) => ({
    ...student,
    firstName: student.firstName.toUpperCase(),
    birthday: formatDate(student.birthday),
    phone1: formatPhone(student.phone1),
    phone2: formatPhone(student.phone2),
  }))
}

const HomeComponent = () => {
  const classes = useStyles()
  const [students, setStudents] = useState(formatMockData())
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>('ADD')
  const [actionData, setActionData] = useState({})
  const openStudentDialog = (type: string): void => {
    setActionType(type)
    setOpenStudentDialog(true)
  }

  const closeStudentDialog = (): void => {
    setActionType('ADD')
    setActionData({})
    setOpenStudentDialog(false)
  }

  const handleClickAction = (data: any, type: string) => {
    if (type === 'EDIT') {
      setActionData(students.find((student: any) => student.id === data.id))
      openStudentDialog(type)
    }
    if (type === 'DELETE') {
      console.log('DELETE')
    }
  }
  const handleSave = (data: any) => {
    if (actionType === 'ADD') {
      setStudents(
        students.concat({
          ...data,
          id: students.length,
          ...formatFullName(data.fullName),
        })
      )
    } else {
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
    }
  }
  return (
    <div className={classes.home}>
      <Box className={classes.title}>
        <h1>Thông Tin Thiếu Nhi</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={useCallback(() => openStudentDialog('ADD'), [])}
        >
          Add
        </Button>
      </Box>
      <TableComponent
        columns={columns}
        rows={formatStudentTable(students)}
        actions={['EDIT', 'DELETE']}
        onClickAction={handleClickAction}
      />
      <StudentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={useCallback(() => closeStudentDialog(), [])}
        actionType={actionType}
        actionData={actionData}
        onSave={handleSave}
      />
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
})
export default HomeComponent

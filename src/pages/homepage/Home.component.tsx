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

const formatDate = (date: string): string => {
  // format yyyy-MM-dd
  const splitDate = date.split('-')
  return `${splitDate[2]}.${splitDate[1]}.${splitDate[0]}`
}

const formatPhone = (phone: string): string => {
  const splitNumber = phone.split('')
  splitNumber[3] = splitNumber[3] + '.'
  splitNumber[6] = splitNumber[6] + '.'
  return splitNumber.join('')
}

const formatFullName = (fullName: string) => {
  const lastBlankSpace = fullName.lastIndexOf(' ')
  const firstName = fullName.slice(lastBlankSpace).toUpperCase()
  const lastName = fullName.slice(0, lastBlankSpace)
  return { firstName, lastName }
}

const HomeComponent = () => {
  const classes = useStyles()
  const [students, setStudents] = useState(
    MockStudents.map((value, index) => ({ id: index, ...value }))
  )
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>('ADD')
  const [actionData, setActionData] = useState({})
  const openStudentDialog = (type: string): void => {
    setActionType(type)
    setOpenStudentDialog(true)
  }
  console.log('homepage')

  const handleClickAction = (data: any, type: string) => {
    if (type === 'EDIT') {
      console.log(data)
      setActionData(data)
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
          birthday: formatDate(data.birthday),
          phone1: formatPhone(data.phone1),
          phone2: formatPhone(data.phone2),
          ...formatFullName(data.fullName),
        })
      )
    } else {
      setStudents(
        students.map((student: any) => {
          if (student.id === data.id) {
            return {
              ...data,
              birthday: formatDate(data.birthday),
              phone1: formatPhone(data.phone1),
              phone2: formatPhone(data.phone2),
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
        rows={students}
        actions={['EDIT', 'DELETE']}
        onClickAction={handleClickAction}
      />
      <StudentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={useCallback(() => setOpenStudentDialog(false), [])}
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

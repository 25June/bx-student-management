import React, { useState, useCallback } from 'react'
import { Button, Box, Snackbar, Alert, ToggleButtonGroup } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TableComponent from '../../modules/Table/Table.component'
import { students as MockStudents } from '../../mockData/students'
import StudentDialogComponent from '../../modules/student-dialog/StudentDialog.component'
import CardComponent from '../../modules/card/Card.component'
import { StudentActionType } from '../../constant/common'
import { Student } from '../../models/student'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import ToggleButton from '@mui/material/ToggleButton'
import RightPanelComponent from '../../modules/right-panel/RightPanel.component'
import { formatMockData } from '../../utils/common'
import { formatStudentTable } from '../../utils/formatDataForTable'

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

const HomeComponent = () => {
  const [students, setStudents] = useState<Student[]>(formatMockData(MockStudents))
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)
  const [isOpenSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackBarMessage, setSnackBarMessage] = useState<string>('')
  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<Student | null>()
  const [isOpenRightPanel, setOpenRightPanel] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>()

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
      setActionData(null)
    }, 0)
  }

  const openSnackBar = (message: string) => {
    setSnackBarMessage(message)
    setOpenSnackbar(true)
  }

  const handleClickAction = (data: Student, type: string) => {
    if (type === StudentActionType.VIEW_STUDENT) {
      setSelectedStudent(data)
      setOpenRightPanel(true)
    } else {
      const student = students.find((std: Student) => std.id === data.id)
      if (student) {
        setActionData(student)
        openStudentDialog(type)
      }
    }
  }

  const handleClosePanel = () => {
    setOpenRightPanel(false)
  }

  const handleSave = (data: Student | Omit<Student, 'id'>) => {
    switch (actionType) {
      case StudentActionType.ADD_NEW_STUDENT:
        setStudents(
          students
            .concat({
              ...data,
              id: students.length.toString(),
            })
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
        )
        openSnackBar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`)
        break
      case StudentActionType.EDIT_STUDENT:
        setStudents(
          students.map((student: Student) => {
            if (student.id === (data as Student).id) {
              if (selectedStudent && selectedStudent.id === (data as Student).id) {
                setSelectedStudent(data as Student)
              }
              return data as Student
            }
            return student
          })
        )
        openSnackBar(`Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`)
        break
      case StudentActionType.DELETE_STUDENT:
        setStudents(students.filter((student: Student) => student.id !== (data as Student).id))
        openSnackBar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`)
        break
      default:
        console.log('can not match action type ' + actionType)
        break
    }
  }
  return (
    <Box width={'100%'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Thông Tin Thiếu Nhi</h1>
        <Box display={'flex'}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={useCallback(() => openStudentDialog(StudentActionType.ADD_NEW_STUDENT), [])}
            sx={{ marginRight: 2 }}
          >
            Thêm Thiếu Nhi
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        </Box>
      </Box>
      {displayType === 'table' ? (
        <TableComponent
          columns={columns}
          rows={formatStudentTable(students)}
          onClickAction={handleClickAction}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {students.map((student: any) => (
            <Box mb={4} ml={1} mr={1} key={student.id}>
              <CardComponent student={student} onClickAction={handleClickAction} />
            </Box>
          ))}
          <RightPanelComponent
            isOpen={isOpenRightPanel}
            data={selectedStudent}
            onClose={handleClosePanel}
            onClickAction={handleClickAction}
          />
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
    </Box>
  )
}

export default HomeComponent

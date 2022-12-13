import React, { useState, useCallback, useEffect } from 'react'
import { Button, Box, Snackbar, Alert, ToggleButtonGroup, AlertProps } from '@mui/material'
import { students as MockStudents } from '../../mockData/students'
import { StudentActionType } from '../../constant/common'
import { Score, ScoreBook, Student } from '../../models/student'
import { formatMockData } from '../../utils/common'
import { formatStudentTable } from '../../utils/formatDataForTable'
import {
  LayoutComponent,
  InfoPanelComponent,
  StudentDialogComponent,
  CardComponent,
  TableComponent,
  ScoreBookPanelComponent,
} from '../../modules/index'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import ToggleButton from '@mui/material/ToggleButton'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {
  useAddNewStudent,
  useGetStudents,
  useUpdateStudent,
  useDeleteStudent,
} from '../../services/student'
import useMediaQuery from '@mui/material/useMediaQuery'

const columns = [
  { field: 'saintName', headerName: 'Tên Thánh' },
  { field: 'lastName', headerName: 'Họ' },
  { field: 'firstName', headerName: 'Tên' },
  { field: 'birthday', headerName: 'Ngày Sinh' },
  { field: 'address', headerName: 'Địa Chỉ' },
  { field: 'grade', headerName: 'Văn Hoá' },
  { field: 'phones', headerName: 'Điện Thoại' },
]

const defaultScore: Score = {
  updatedDate: Date.now(),
  point: 10,
}
const defaultScoreBook: ScoreBook = {
  score5: {
    date1: defaultScore,
    date2: defaultScore,
  },
  score15: {
    date1: defaultScore,
    date2: defaultScore,
  },
  score45: {
    date1: defaultScore,
    date2: defaultScore,
  },
  score60: {
    date1: defaultScore,
    date2: defaultScore,
  },
}

const HomeComponent = () => {
  const mobile = useMediaQuery('(max-width:900px)')
  const [students, setStudents] = useState<Student[]>(formatMockData(MockStudents))
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)
  const [isOpenSnackbar, setOpenSnackbar] = useState<boolean>(false)

  const [snackBarMessage, setSnackBarMessage] = useState<string>('')
  const [snackBarSeverity, setSnackBarSeverity] = useState<AlertProps['severity']>('success')

  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<Student | null>()
  const [isOpenRightPanel, setOpenRightPanel] = useState(false)
  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>()
  const [displayType, setDisplayType] = React.useState<string | null>('card')

  const addNewStudent = useAddNewStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const { students: dbStudents } = useGetStudents()
  useEffect(() => {
    if (dbStudents) {
      setStudents([...dbStudents, ...students])
    }
  }, [dbStudents])

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
    if (type === StudentActionType.VIEW_SCORE_BOOK) {
      setSelectedStudent(data)
      setOpenScoreBook(true)
      return
    }
    if (type === StudentActionType.VIEW_STUDENT) {
      setSelectedStudent(data)
      setOpenRightPanel(true)
      return
    }
    const student = students.find((std: Student) => std.id === data.id)
    if (student) {
      setActionData(student)
      openStudentDialog(type)
    }
  }

  const handleClosePanel = () => {
    setOpenRightPanel(false)
  }

  const handleCloseScoreBook = () => {
    setOpenScoreBook(false)
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
        addNewStudent({
          dataInput: data,
          onSuccess: () =>
            openSnackBar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`),
          onError: () => {
            setSnackBarSeverity('error')
            openSnackBar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`)
          },
          onComplete: () => console.log('complete request'),
        })
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
        updateStudent({
          dataInput: data as Student,
          onSuccess: () =>
            openSnackBar(`Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`),
          onError: () => {
            setSnackBarSeverity('error')
            openSnackBar(`Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`)
          },
          onComplete: () => console.log('complete request'),
        })
        break
      case StudentActionType.DELETE_STUDENT:
        setStudents(students.filter((student: Student) => student.id !== (data as Student).id))
        deleteStudent({
          dataInput: data as Student,
          onSuccess: () =>
            openSnackBar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`),
          onError: () => {
            setSnackBarSeverity('error')
            openSnackBar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`)
          },
          onComplete: () => console.log('complete request'),
        })
        break
      default:
        console.log('can not match action type ' + actionType)
        break
    }
  }
  return (
    <LayoutComponent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: mobile ? 'column' : 'row',
          width: '100%',
        }}
      >
        <Box component={'h1'} sx={{ paddingLeft: 1, paddingRight: 1 }}>
          Thông Tin Thiếu Nhi
        </Box>
        <Box display={'flex'} sx={{ paddingLeft: 1, paddingRight: 1 }}>
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
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          {students.map((student: any) => (
            <Box mb={4} ml={1} mr={1} key={student.id}>
              <CardComponent student={student} onClickAction={handleClickAction} />
            </Box>
          ))}
          <InfoPanelComponent
            isOpen={isOpenRightPanel}
            data={selectedStudent}
            onClose={handleClosePanel}
            onClickAction={handleClickAction}
          />
          <ScoreBookPanelComponent
            isOpen={isOpenScoreBook}
            studentInfo={selectedStudent}
            scoreBook={defaultScoreBook}
            onClose={handleCloseScoreBook}
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
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackBarSeverity}
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </LayoutComponent>
  )
}

export default HomeComponent

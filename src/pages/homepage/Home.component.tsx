import React, { useState, useEffect } from 'react'
import { Button, Box, ToggleButtonGroup } from '@mui/material'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import TableRowsIcon from '@mui/icons-material/TableRows'
import StyleIcon from '@mui/icons-material/Style'
import ToggleButton from '@mui/material/ToggleButton'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAddNewStudent, useUpdateStudent, useDeleteStudent } from 'services'
import { renderStudentActions, studentColumns } from 'modules/Table/helpers'
import {
  InfoPanelComponent,
  TableComponent,
  ScoreBookPanelComponent,
  StudentDialogComponent,
  CardComponent,
  LayoutComponent,
} from 'modules'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useIsMobile } from 'utils/common'

const HomeComponent = () => {
  const mobile = useIsMobile()
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)

  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<Student | null>()
  const [isOpenRightPanel, setOpenRightPanel] = useState(false)
  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student>()
  const [displayType, setDisplayType] = React.useState<string | null>('card')

  const addNewStudent = useAddNewStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const { students } = useStudentContext()
  const { showSnackbar } = useSnackbarContext()

  useEffect(() => {
    if (selectedStudent && students) {
      const newData = students.find((student: Student) => student.id === selectedStudent.id)
      if (newData) {
        setSelectedStudent(newData)
      }
    }
  }, [students, selectedStudent])

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
    const student = (students || []).find((std: Student) => std.id === data.id)
    if (student) {
      setActionData({
        ...student,
        fullName: student.lastName + ' ' + student.firstName,
      })
      openStudentDialog(type)
    }
  }

  const handleClosePanel = () => {
    setOpenRightPanel(false)
  }

  const handleCloseScoreBook = () => {
    setSelectedStudent(undefined)
    setOpenScoreBook(false)
  }

  const handleSave = (data: Student | Omit<Student, 'id'>) => {
    switch (actionType) {
      case StudentActionType.ADD_NEW_STUDENT:
        addNewStudent({
          dataInput: data,
          onSuccess: () => {
            showSnackbar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`, 'success')
            closeStudentDialog()
          },
          onError: () => {
            showSnackbar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`, 'error')
          },
          onComplete: () => console.log('complete request'),
        })
        break
      case StudentActionType.EDIT_STUDENT:
        updateStudent({
          dataInput: data as Student,
          onSuccess: () => {
            showSnackbar(
              `Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`,
              'success'
            )
            closeStudentDialog()
          },
          onError: () => {
            showSnackbar(`Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`, 'error')
          },
          onComplete: () => console.log('complete request'),
        })
        break
      case StudentActionType.DELETE_STUDENT:
        deleteStudent({
          dataInput: data as Student,
          onSuccess: () => {
            showSnackbar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`, 'success')
            closeStudentDialog()
          },
          onError: () => {
            showSnackbar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`, 'error')
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
          marginBottom: mobile ? 2 : 1,
        }}
      >
        <Box component={mobile ? 'h3' : 'h1'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Thông Tin Thiếu Nhi
        </Box>
        <Box display={'flex'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => openStudentDialog(StudentActionType.ADD_NEW_STUDENT)}
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
          columns={studentColumns}
          rows={students || []}
          onClickAction={handleClickAction}
          renderActionMenu={renderStudentActions}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 5,
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          {(students || []).map((student: Student) => (
            <Box key={student.id} sx={{ display: 'flex', columnGap: 16, rowGap: 16 }}>
              <CardComponent student={student} onClickAction={handleClickAction} />
            </Box>
          ))}
          <InfoPanelComponent
            isOpen={isOpenRightPanel}
            studentInfo={selectedStudent}
            onClose={handleClosePanel}
            onClickAction={handleClickAction}
          />
          {isOpenScoreBook && selectedStudent && (
            <ScoreBookPanelComponent
              isOpen={!!selectedStudent}
              onClose={handleCloseScoreBook}
              studentId={selectedStudent.id}
            />
          )}
        </Box>
      )}
      <StudentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={() => closeStudentDialog()}
        actionType={actionType}
        actionData={actionData}
        onSave={handleSave}
      />
    </LayoutComponent>
  )
}

export default HomeComponent

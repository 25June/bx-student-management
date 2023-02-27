import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { StudentActionType } from 'constant'
import {
  LayoutComponent,
  ScoreBookPanelComponent,
  StudentDialogComponent,
  TableComponent,
} from 'modules'
import { ScoreBookColumns } from 'modules/Table/helpers'
import { Score, ScoreBook, Student } from 'models'
import React, { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetStudents, useGetStudentScoreBooks } from 'services'
import { getToday } from 'utils'

const defaultScore: Score = {
  bookDate: getToday(),
  score: 10,
}
const defaultScoreBook: ScoreBook = {
  id: '',
  studentId: '',
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

const ScoreBookComponent = () => {
  const mobile = useMediaQuery('(max-width:900px)')
  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)

  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<Student | null>()

  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student>()
  const { students } = useGetStudents()
  const { studentScoreBooks } = useGetStudentScoreBooks()

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
    const student = (students || []).find((std: Student) => std.id === data.id)
    if (student) {
      setActionData(student)
      openStudentDialog(type)
    }
  }

  const handleCloseScoreBook = () => {
    setOpenScoreBook(false)
  }

  useEffect(() => {
    if (selectedStudent && students) {
      const newData = students.find((student: Student) => student.id === selectedStudent.id)
      if (newData) {
        setSelectedStudent(newData)
      }
    }
  }, [students, selectedStudent])
  return (
    <LayoutComponent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: mobile ? 'column' : 'row',
        }}
      >
        <Box component={mobile ? 'h3' : 'h1'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Bảng Điểm
        </Box>
        <Box display={'flex'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => openStudentDialog(StudentActionType.ADD_NEW_STUDENT)}
            sx={{ marginRight: 2 }}
          >
            Thêm Bài Kiểm Tra
          </Button>
        </Box>
      </Box>
      <TableComponent
        columns={ScoreBookColumns}
        rows={studentScoreBooks || []}
        onClickAction={handleClickAction}
      />
      <ScoreBookPanelComponent
        isOpen={isOpenScoreBook}
        studentInfo={selectedStudent}
        scoreBook={defaultScoreBook}
        onClose={handleCloseScoreBook}
        onClickAction={handleClickAction}
      />
      <StudentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={() => closeStudentDialog()}
        actionType={actionType}
        actionData={actionData}
        onSave={() => {
          console.log('save')
        }}
      />
    </LayoutComponent>
  )
}

export default ScoreBookComponent

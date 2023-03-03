import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { ScoreBookActionType } from 'constant'
import {
  LayoutComponent,
  ScoreBookPanelComponent,
  ScoreBookDialogComponent,
  TableComponent,
} from 'modules'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { Score, ScoreBook, StudentScoreBooks } from 'models'
import React, { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetStudentScoreBooks } from 'services'
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
  const [isOpenScoreBookDialog, setOpenScoreBookDialog] = useState<boolean>(false)

  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<StudentScoreBooks | null>()

  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const { studentScoreBooks } = useGetStudentScoreBooks()

  const openStudentDialog = (type: string): void => {
    setActionType(type)
    setOpenScoreBookDialog(true)
  }

  const closeScoreBookDialog = (): void => {
    setOpenScoreBookDialog(false)
    setTimeout(() => {
      setActionType('')
      setActionData(null)
    }, 0)
  }

  const handleClickAction = (data: StudentScoreBooks, type: string) => {
    if (type === ScoreBookActionType.VIEW_SCORE_BOOK) {
      setSelectedScoreBook(data)
      setOpenScoreBook(true)
      return
    }
    const student = (studentScoreBooks || []).find(
      (std: StudentScoreBooks) => std.studentId === data.studentId
    )
    if (student) {
      setActionData(student)
      openStudentDialog(type)
    }
  }

  const handleCloseScoreBook = () => {
    setOpenScoreBook(false)
  }

  useEffect(() => {
    if (selectedScoreBook && studentScoreBooks) {
      const newData = studentScoreBooks.find(
        (student: StudentScoreBooks) => student.studentId === selectedScoreBook.studentId
      )
      if (newData) {
        setSelectedScoreBook(newData)
      }
    }
  }, [studentScoreBooks, setSelectedScoreBook])
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
            onClick={() => openStudentDialog(ScoreBookActionType.ADD_NEW_SCORE_BOOK)}
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
        renderActionMenu={renderScoreBookActions}
      />
      <ScoreBookPanelComponent
        isOpen={isOpenScoreBook}
        studentInfo={{} as any}
        scoreBook={defaultScoreBook}
        onClose={handleCloseScoreBook}
        onClickAction={handleClickAction}
      />
      <ScoreBookDialogComponent
        isOpen={isOpenScoreBookDialog}
        onClose={() => closeScoreBookDialog()}
        action={actionType}
        data={actionData}
        onSave={() => {
          console.log('save')
        }}
      />
    </LayoutComponent>
  )
}

export default ScoreBookComponent

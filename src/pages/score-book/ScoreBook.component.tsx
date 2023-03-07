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
import { ScoreBook, StudentScoreBooks } from 'models'
import React, { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGetStudentScoreBooks } from 'services'

const defaultScoreBook: ScoreBook = {
  id: '',
  score5: {
    date1: 10,
    date2: 10,
  },
  score15: {
    date1: 10,
    date2: 10,
  },
  score45: {
    date1: 10,
    date2: 10,
  },
  score60: {
    date1: 10,
    date2: 10,
  },
}

const ScoreBookComponent = () => {
  const mobile = useMediaQuery('(max-width:900px)')
  const [isOpenScoreBookDialog, setOpenScoreBookDialog] = useState<boolean>(false)

  const [actionData, setActionData] = useState<StudentScoreBooks | null>()

  const [isOpenScoreBook, setOpenScoreBook] = useState(false)
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const { studentScoreBooks } = useGetStudentScoreBooks()

  const openScoreBookDialog = (): void => {
    setOpenScoreBookDialog(true)
  }

  const closeScoreBookDialog = (): void => {
    setOpenScoreBookDialog(false)
    setTimeout(() => {
      setActionData(null)
    }, 0)
  }

  const handleClickAction = (data: StudentScoreBooks, type: string) => {
    if (type === ScoreBookActionType.VIEW_SCORE_BOOK) {
      setSelectedScoreBook(data)
      setOpenScoreBook(true)
      return
    }
    const student = (studentScoreBooks || []).find((std: StudentScoreBooks) => std.id === data.id)
    if (student) {
      setActionData(student)
      openScoreBookDialog()
    }
  }

  const handleCloseScoreBook = () => {
    setOpenScoreBook(false)
  }

  useEffect(() => {
    if (selectedScoreBook && studentScoreBooks) {
      const newData = studentScoreBooks.find(
        (student: StudentScoreBooks) => student.id === selectedScoreBook.id
      )
      if (newData) {
        setSelectedScoreBook(newData)
      }
    }
  }, [studentScoreBooks, setSelectedScoreBook, selectedScoreBook])
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
            onClick={() => openScoreBookDialog()}
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
      {isOpenScoreBookDialog && (
        <ScoreBookDialogComponent
          isOpen={isOpenScoreBookDialog}
          onClose={() => closeScoreBookDialog()}
          data={actionData}
        />
      )}
    </LayoutComponent>
  )
}

export default ScoreBookComponent

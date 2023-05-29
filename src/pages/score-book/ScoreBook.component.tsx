import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks } from 'models'
import React, { useState } from 'react'
import { useGetStudentScoreBooks } from 'services'
import { useStudentContext } from 'contexts/StudentContext'
import AssessmentDialogComponent from 'modules/assessment-dialog/AssessmentDialog.component'
import { AssessmentActionType } from 'constant'
import { useClassContext } from 'contexts/ClassContext'
import { Typography } from '@mui/material'

const ScoreBookComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const { studentScoreBooks: stuScoreBooks } = useGetStudentScoreBooks({ students, classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [isOpenAssessmentDialog, openAssessmentDialog] = useState<boolean>(false)

  return (
    <Box p={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          marginTop: 2,
        }}
      >
        <Typography variant={'h1'}>Bảng Điểm</Typography>
        <Button
          variant="contained"
          startIcon={<AssignmentIcon />}
          onClick={() => openAssessmentDialog(true)}
        >
          Thêm Bài Kiểm Tra
        </Button>
      </Box>
      {stuScoreBooks && stuScoreBooks.length !== 0 && (
        <TableComponent
          columns={ScoreBookColumns}
          rows={stuScoreBooks}
          onClickAction={(data: StudentScoreBooks) => setSelectedScoreBook(data)}
          renderActionMenu={renderScoreBookActions}
        />
      )}
      {!!selectedScoreBook && (
        <ScoreBookDialogComponent
          isOpen={!!selectedScoreBook}
          onClose={() => setSelectedScoreBook(undefined)}
          data={selectedScoreBook}
        />
      )}
      {isOpenAssessmentDialog && (
        <AssessmentDialogComponent
          key={'new'}
          isOpen={isOpenAssessmentDialog}
          onClose={() => openAssessmentDialog(false)}
          action={AssessmentActionType.ADD_NEW_ASSESSMENT}
          data={null}
        />
      )}
    </Box>
  )
}

export default ScoreBookComponent

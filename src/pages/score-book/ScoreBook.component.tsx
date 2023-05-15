import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LayoutComponent from 'modules/layout/Layout.component'
import TableComponent from 'modules/Table/Table.component'
import ScoreBookDialogComponent from 'modules/score-book-dialog/ScoreBookDialog.component'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { StudentScoreBooks } from 'models'
import React, { useState } from 'react'
import { useGetStudentScoreBooks } from 'services'
import { useStudentContext } from 'contexts/StudentContext'
import { useIsMobile } from 'utils/common'
import AssessmentDialogComponent from 'modules/assessment-dialog/AssessmentDialog.component'
import { AssessmentActionType } from 'constant'
import { useClassContext } from 'contexts/ClassContext'

const ScoreBookComponent = () => {
  const mobile = useIsMobile()
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const { studentScoreBooks: stuScoreBooks } = useGetStudentScoreBooks({ students, classId })
  const [selectedScoreBook, setSelectedScoreBook] = useState<StudentScoreBooks>()
  const [isOpenAssessmentDialog, openAssessmentDialog] = useState<boolean>(false)

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
            onClick={() => openAssessmentDialog(true)}
            sx={{ marginRight: 2 }}
          >
            Thêm Bài Kiểm Tra
          </Button>
        </Box>
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
    </LayoutComponent>
  )
}

export default ScoreBookComponent

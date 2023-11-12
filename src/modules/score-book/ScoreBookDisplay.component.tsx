import React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { blueGrey } from '@mui/material/colors'
import Grow from '@mui/material/Grow'
import TableComponent from 'modules/Table/Table.component'
import { renderScoreBookActions, ScoreBookColumns } from 'modules/Table/helpers'
import { Assessment, Student, StudentScoreBook } from 'models'
import SingleScoreViewComponent from 'modules/single-score-view/SingleScoreView.component'
import { get } from 'lodash'
import DiligentSkeleton from 'modules/diligent/DiligentSkeleton.component'
import { useIsMobile } from 'utils/common'

export interface ScoreBookDisplayComponentProps {
  filteredStuScoreBooks: StudentScoreBook[] | Student[]
  setSelectedScoreBook: (data: StudentScoreBook) => void
  selectedAssessmentDate?: Assessment
  selectedAssessmentType?: string
  handleUpdateScore: (
    studentId: string
  ) => (type: string) => (score: { score: number }, assessmentId: string) => void
}

const ScoreBookDisplayComponent = ({
  handleUpdateScore,
  selectedAssessmentType,
  filteredStuScoreBooks,
  setSelectedScoreBook,
  selectedAssessmentDate,
}: ScoreBookDisplayComponentProps) => {
  const isMobile = useIsMobile()
  if (filteredStuScoreBooks.length === 0) {
    return <DiligentSkeleton />
  }
  if (isMobile) {
    if (selectedAssessmentDate && selectedAssessmentType) {
      return (
        <Grow in={!!(selectedAssessmentDate && selectedAssessmentType)}>
          <Stack gap={2}>
            {filteredStuScoreBooks.map((row) => (
              <SingleScoreViewComponent
                key={row.id}
                student={row}
                score={get(row, [`${selectedAssessmentType}`, `${selectedAssessmentDate.id}`], 0)}
                assessment={selectedAssessmentDate}
                onChangeData={handleUpdateScore(row.id)(selectedAssessmentType)}
              />
            ))}
          </Stack>
        </Grow>
      )
    }
    return (
      <Box>
        <Typography textTransform={'capitalize'} variant={'caption'} color={blueGrey[700]}>
          <i>Hãy chọn loại và ngày làm bài kiểm tra</i>
        </Typography>
      </Box>
    )
  }
  return (
    <TableComponent
      columns={ScoreBookColumns}
      rows={filteredStuScoreBooks}
      onClickAction={(data: StudentScoreBook) => setSelectedScoreBook(data)}
      renderActionMenu={renderScoreBookActions}
    />
  )
}

export default ScoreBookDisplayComponent

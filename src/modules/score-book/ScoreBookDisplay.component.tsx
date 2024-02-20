import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { blueGrey } from '@mui/material/colors'
import Grow from '@mui/material/Grow'
import { Assessment, Student, StudentScoreBook } from 'models'
import SingleScoreViewComponent from 'modules/single-score-view/SingleScoreView.component'
import { get } from 'lodash'
import DiligentSkeleton from 'modules/diligent/DiligentSkeleton.component'
import ScorebookTable from 'modules/score-book-table/ScoreBookTable.component'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { AssessmentActionType, DialogType } from 'constant/common'
import { useDialogContext } from 'contexts/DialogContext'
import { useClassContext } from 'contexts/ClassContext'

import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
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
  // setSelectedScoreBook,
  selectedAssessmentDate,
}: ScoreBookDisplayComponentProps) => {
  const { assessments } = useAssessmentContext()
  const { disableUpdate } = useClassContext()
  const { openDialog } = useDialogContext()
  const isMobile = useIsMobile()

  if (filteredStuScoreBooks.length === 0) {
    return <DiligentSkeleton />
  }
  if (selectedAssessmentDate && selectedAssessmentType) {
    return (
      <Grow in={!!(selectedAssessmentDate && selectedAssessmentType)}>
        <Box
          sx={{
            background: 'transparent',
            backdropFilter: 'blur(2px)',
            height: 'calc(100vh - 322px)',
            WebkitMask: 'linear-gradient(0deg,#0000,#000 5% 95%,#0000)',
          }}
        >
          <AutoSizer>
            {({ height, width }: any) => (
              <FixedSizeList
                height={height}
                itemCount={(filteredStuScoreBooks || []).length}
                itemSize={isMobile ? 156 : 170}
                width={width}
              >
                {({ index, style }) => (
                  <div style={style}>
                    <SingleScoreViewComponent
                      key={filteredStuScoreBooks[index].id}
                      student={filteredStuScoreBooks[index]}
                      score={get(
                        filteredStuScoreBooks[index],
                        [`${selectedAssessmentType}`, `${selectedAssessmentDate.id}`],
                        0
                      )}
                      assessment={selectedAssessmentDate}
                      onChangeData={handleUpdateScore(filteredStuScoreBooks[index].id)(
                        selectedAssessmentType
                      )}
                    />
                  </div>
                )}
              </FixedSizeList>
            )}
          </AutoSizer>
        </Box>
      </Grow>
    )
  }
  if (assessments.length === 0) {
    return (
      <Box>
        <Typography textTransform={'capitalize'} variant={'caption'} color={blueGrey[700]}>
          <i>Chưa có bài kiểm tra nào được tạo</i>
        </Typography>
        <Button
          variant={'contained'}
          onClick={() =>
            openDialog(
              DialogType.ASSESSMENT_DIALOG,
              AssessmentActionType.ADD_NEW_ASSESSMENT,
              undefined,
              undefined
            )
          }
          disabled={disableUpdate}
        >
          Thêm bài kiểm tra
        </Button>
      </Box>
    )
  }

  return (
    <ScorebookTable
      assessments={assessments}
      studentScoreBooks={filteredStuScoreBooks as StudentScoreBook[]}
    />
  )
}

export default ScoreBookDisplayComponent

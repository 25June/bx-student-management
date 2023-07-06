import React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grow from '@mui/material/Grow'
import TableComponent from 'modules/Table/Table.component'
import {
  GroupAssessmentProps,
  renderScoreBookActions,
  ScoreBookColumns,
} from 'modules/Table/helpers'
import { Assessment, Student, StudentScoreBooks } from 'models'
import SingleScoreViewComponent from 'modules/single-score-view/SingleScoreView.component'
import { get } from 'lodash'
import DiligentSkeleton from 'modules/diligent/DiligentSkeleton.component'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TableFullNameCellComponent from 'modules/common/TableFullNameCell.component'
import AccordionDetails from '@mui/material/AccordionDetails'
import ScoreBookAccordionComponent from 'modules/score-book/ScoreBookAccordion.component'
import { useIsMobile } from 'utils/common'

export interface ScoreBookDisplayComponentProps {
  filteredStuScoreBooks: StudentScoreBooks[] | Student[]
  setSelectedScoreBook: (data: StudentScoreBooks) => void
  selectedAssessmentDate?: Assessment
  selectedAssessmentType?: string
  handleUpdateScore: (
    studentId: string
  ) => (type: string) => (score: { score: number }, assessmentId: string) => void
  groupAssessment?: GroupAssessmentProps
}

const ScoreBookDisplayComponent = ({
  groupAssessment,
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
        {filteredStuScoreBooks.map((row) => (
          <Accordion key={row.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`scorebook-accordion-content-${row.id}`}
              id={`scorebook-accordion-header-${row.id}`}
            >
              <TableFullNameCellComponent
                avatarPath={row.avatarPath}
                saintName={row.saintName}
                lastName={row.lastName}
                firstName={row.firstName}
                gender={!!row.gender}
              />
            </AccordionSummary>
            <AccordionDetails>
              <ScoreBookAccordionComponent
                key={row.id}
                studentScoreBook={row as StudentScoreBooks}
                groupAssessment={groupAssessment}
                onChangeScore={handleUpdateScore(row.id)}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    )
  }
  return (
    <TableComponent
      columns={ScoreBookColumns}
      rows={filteredStuScoreBooks}
      onClickAction={(data: StudentScoreBooks) => setSelectedScoreBook(data)}
      renderActionMenu={renderScoreBookActions}
    />
  )
}

export default ScoreBookDisplayComponent

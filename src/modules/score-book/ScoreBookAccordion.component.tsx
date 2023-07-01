import { Assessment, ScoreBook, StudentScoreBooks } from 'models'
import { GroupAssessmentProps } from 'modules/Table/helpers'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { getScoreName } from 'utils/getScoreName'
import { averageScore } from 'modules/score-book-panel/helpers'
import AccordionDetails from '@mui/material/AccordionDetails'
import ScoreForm from 'modules/common/ScoreForm.component'
import React from 'react'
import { ScoreEnum } from 'constant/common'

interface ScoreBookAccordionComponentProps {
  studentScoreBook: StudentScoreBooks
  groupAssessment: GroupAssessmentProps
  onChangeScore: (type: string) => (score: { score: number }, assessmentId: string) => void
}

const ScoreBookAccordionComponent = ({
  studentScoreBook,
  groupAssessment,
  onChangeScore,
}: ScoreBookAccordionComponentProps) => {
  if (!studentScoreBook) {
    return null
  }
  return (
    <Box>
      {Object.values(ScoreEnum).map((scoreType: string) => {
        const scoreList = studentScoreBook[scoreType as keyof ScoreBook] as Record<string, number>
        const assessmentByScoreType = groupAssessment[scoreType as keyof GroupAssessmentProps]
        return (
          <Accordion key={scoreType}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '80% 20%',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <Typography sx={{ flexShrink: 0, fontSize: '0.75rem' }}>
                  Trung Bình {getScoreName(scoreType)}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {averageScore(scoreList ? Object.values(scoreList) : [])}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {assessmentByScoreType.map((assessment: Assessment) => {
                return (
                  <ScoreForm
                    data={scoreList?.[assessment.id] || 0}
                    assessment={assessment}
                    key={`${assessment.id}_${scoreList?.[assessment.id] || 0}`}
                    onChangeData={onChangeScore(scoreType)}
                  />
                )
              })}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}

export default ScoreBookAccordionComponent

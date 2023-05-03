import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import { Button } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import studentBoyLogo from 'static/images/cards/student-boy.png'
import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { averageScore } from './helpers'
import {
  useGetStudentScoreBook,
  useInitStudentScore,
  useSetNewStudentScore,
} from 'services/scorebook'
import { useGetStudentById } from 'services/student'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { Assessment } from 'models'
import ScoreForm from 'modules/common/ScoreForm.component'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { groupAssessments } from 'modules/Table/helpers'

interface ScoreBookPanelComponentProps {
  isOpen: boolean
  studentId: string
  onClose: () => void
}

const ScoreBookPanelComponent = ({ isOpen, studentId, onClose }: ScoreBookPanelComponentProps) => {
  const { studentScoreBook: scoreBook } = useGetStudentScoreBook(studentId)
  const { student: studentInfo } = useGetStudentById(studentId)
  const initStudentScore = useInitStudentScore()
  const { assessments } = useAssessmentContext()
  const setStudentScore = useSetNewStudentScore()
  const { showSnackbar } = useSnackbarContext()

  const handleChangeData = (type: string) => (score: { score: number }, assessmentId: string) => {
    if (studentId) {
      setStudentScore(studentId, type, score, assessmentId)
        .then(() => showSnackbar('Cập nhật thành công', 'success'))
        .catch(() => showSnackbar('Cập nhật thất bại', 'error'))
    }
  }

  const groupAssessment = groupAssessments(assessments)

  if (scoreBook === null) {
    initStudentScore(studentId)
  }

  if (!scoreBook || !studentInfo) {
    return null
  }

  return (
    <MuiDrawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      sx={{ width: '100%', maxWidth: 375 }}
    >
      <Box pt={9} pr={2} pl={2} mb={5}>
        <Box display={'flex'} alignItems={'center'} mb={2}>
          <Button color={'primary'} onClick={onClose} startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Box>
        <Box component={'img'} src={studentBoyLogo} alt={'image-detail'} sx={{ width: '100%' }} />
        <Box>
          <Box textAlign={'center'} component={'h2'} margin={0}>
            {studentInfo.saintName}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0}>
            {`${studentInfo.lastName} ${studentInfo.firstName}`}
          </Box>
          <Box>
            {['score5', 'score15', 'score45', 'score60'].map((scoreType: string) => {
              return (
                <Accordion key={scoreType}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: '70%', flexShrink: 0 }}>TB {scoreType}: </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {averageScore(Object.values((scoreBook as any)[scoreType]))}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {(groupAssessment as any)[scoreType].map((assessment: Assessment) => {
                      const score = (scoreBook as any)[scoreType]
                      return (
                        <ScoreForm
                          data={score[assessment.id]}
                          assessment={assessment}
                          key={`${assessment.id}_${score[assessment.id]}`}
                          onChangeData={handleChangeData(scoreType)}
                        />
                      )
                    })}
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Box>
        </Box>
      </Box>
    </MuiDrawer>
  )
}

export default ScoreBookPanelComponent

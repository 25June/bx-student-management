import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { Button } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import React, { useState, useEffect, useCallback } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import { averageScore } from './helpers'
import {
  getStudentScoreBook,
  useSetNewStudentScore1,
  initDefaultScoreBook,
} from 'services/scorebook'
import { useGetStudentById } from 'services/student'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { Assessment, ScoreBook } from 'models'
import ScoreForm from 'modules/common/ScoreForm.component'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { groupAssessments, GroupAssessmentProps } from 'modules/Table/helpers'
import { ImageBoxComponent } from 'modules/index'
import { useClassContext } from 'contexts/ClassContext'
import { getScoreName } from 'utils/getScoreName'
import { AssessmentActionType, DialogType, ScoreEnum } from 'constant/common'
import { useDialogContext } from 'contexts/DialogContext'
import { fetchAssessments } from 'services'

interface ScoreBookPanelComponentProps {
  isOpen: boolean
  studentId: string
  onClose: () => void
}

const ScoreBookPanelComponent = ({ isOpen, studentId, onClose }: ScoreBookPanelComponentProps) => {
  const { student: studentInfo } = useGetStudentById(studentId)
  const { assessments, setAssessments } = useAssessmentContext()
  const setStudentScore = useSetNewStudentScore1()
  const { showSnackbar } = useSnackbarContext()
  const { classId } = useClassContext()
  const { openDialog } = useDialogContext()

  const [scoreBook, setStudentScoreBook] = useState<ScoreBook>()
  const handleFetchStudentScoreBook = useCallback(() => {
    getStudentScoreBook({ classId, studentId })
      .then((value) => {
        if (value === 'EMPTY_DATA' && assessments?.length !== 0) {
          const initValue = initDefaultScoreBook(assessments)
          setStudentScoreBook({ ...initValue, id: studentId })
          return
        }
        setStudentScoreBook(value)
      })
      .catch((error) => {
        console.error(error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, studentId, assessments])

  const handleOpenAssessmentDialog = useCallback(() => {
    const assessmentCallBack = () => {
      setTimeout(() => {
        fetchAssessments(classId).then((res) => {
          setAssessments(res)
        })
      }, 100)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    openDialog(
      DialogType.ASSESSMENT_DIALOG,
      AssessmentActionType.ADD_NEW_ASSESSMENT,
      null,
      assessmentCallBack
    )
  }, [openDialog, classId, setAssessments])

  useEffect(() => {
    if (studentId) {
      handleFetchStudentScoreBook()
    }
  }, [handleFetchStudentScoreBook, studentId])

  const handleChangeData = (type: string) => (score: { score: number }, assessmentId: string) => {
    if (studentId) {
      setStudentScore({ studentId, type, score: score.score, assessmentId, classId })
        .then(() => {
          handleFetchStudentScoreBook()
          showSnackbar('Cập nhật thành công', 'success')
        })
        .catch(() => showSnackbar('Cập nhật thất bại', 'error'))
    }
  }

  const groupAssessment = groupAssessments(assessments)
  if (!studentInfo) {
    return null
  }

  return (
    <Drawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      sx={{ width: '100%', maxWidth: 350 }}
    >
      <Box pt={9} pr={2} pl={2} mb={5}>
        <Box display={'flex'} alignItems={'center'} mb={2}>
          <Button color={'primary'} onClick={onClose} startIcon={<KeyboardBackspaceIcon />}>
            Back
          </Button>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <ImageBoxComponent
            imagePath={studentInfo.avatarPath}
            gender={studentInfo.gender}
            maxWidth={200}
          />
        </Box>
        <Box>
          <Box textAlign={'center'} component={'h2'} margin={0}>
            {studentInfo.saintName}
          </Box>
          <Box textAlign={'center'} component={'h1'} mt={0}>
            {`${studentInfo.lastName} ${studentInfo.firstName}`}
          </Box>
          <Box>
            {scoreBook &&
              Object.values(ScoreEnum).map((scoreType: string) => {
                const scoreList = scoreBook[scoreType as keyof ScoreBook] as Record<string, number>
                const assessmentByScoreType =
                  groupAssessment[scoreType as keyof GroupAssessmentProps]
                return (
                  <Accordion key={scoreType}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '70%', flexShrink: 0 }}>
                        Trung Bình {getScoreName(scoreType)}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {averageScore(scoreList ? Object.values(scoreList) : [])}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {assessmentByScoreType.map((assessment: Assessment) => {
                        return (
                          <ScoreForm
                            data={scoreList?.[assessment.id] || 0}
                            assessment={assessment}
                            key={`${assessment.id}_${scoreList?.[assessment.id] || 0}`}
                            onChangeData={handleChangeData(scoreType)}
                          />
                        )
                      })}
                      <Box sx={{ textAlign: 'right', paddingTop: 1 }}>
                        <Button
                          variant="contained"
                          size={'small'}
                          startIcon={<AddIcon />}
                          onClick={handleOpenAssessmentDialog}
                        >
                          Thêm bài kiểm tra
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ScoreBookPanelComponent

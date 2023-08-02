import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { Button } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import React, { useState, useEffect, useCallback } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { getStudentScoreBook, setNewStudentScore, initDefaultScoreBook } from 'services/scorebook'
import { useGetStudentById } from 'services/student'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { Assessment, ScoreBook } from 'models'
import ScoreForm from 'modules/common/ScoreForm.component'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { ImageBoxComponent } from 'modules/index'
import { useClassContext } from 'contexts/ClassContext'
import { AssessmentActionType, DialogType, ScoreEnum } from 'constant/common'
import { useDialogContext } from 'contexts/DialogContext'
import { fetchAssessments } from 'services'
import Chip from '@mui/material/Chip'
import { get } from 'lodash'

interface ScoreBookPanelComponentProps {
  isOpen: boolean
  studentId: string
  onClose: () => void
}

const ScoreBookPanelComponent = ({ isOpen, studentId, onClose }: ScoreBookPanelComponentProps) => {
  const { student: studentInfo } = useGetStudentById(studentId)
  const { assessments, setAssessments } = useAssessmentContext()
  const { showSnackbar } = useSnackbarContext()
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { openDialog } = useDialogContext()
  const [activeTab, setActiveTab] = useState<string>('score5')

  const [scoreBook, setStudentScoreBook] = useState<ScoreBook>()
  const handleFetchStudentScoreBook = useCallback(() => {
    getStudentScoreBook({ classId, studentId, semesterId, schoolYearId })
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
  }, [classId, studentId, semesterId, schoolYearId, assessments])

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
      setNewStudentScore({
        studentId,
        type,
        score: score.score,
        assessmentId,
        classId,
        semesterId,
        schoolYearId,
      })
        .then(() => {
          handleFetchStudentScoreBook()
          showSnackbar('Cập nhật thành công', 'success')
        })
        .catch(() => showSnackbar('Cập nhật thất bại', 'error'))
    }
  }

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
        <Box mt={1.5}>
          <Box textAlign={'center'} component={'h5'} fontWeight={400} margin={0}>
            {studentInfo.saintName}
          </Box>
          <Box textAlign={'center'} component={'h3'} fontWeight={500} mt={0}>
            {`${studentInfo.lastName} ${studentInfo.firstName}`}
          </Box>
          <Box>
            {scoreBook && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Chip
                    label="KT 5'"
                    color="primary"
                    size={'small'}
                    variant={activeTab === ScoreEnum.SCORE_5 ? 'filled' : 'outlined'}
                    onClick={() => setActiveTab(ScoreEnum.SCORE_5)}
                  />
                  <Chip
                    label="KT 15'"
                    color="primary"
                    size={'small'}
                    variant={activeTab === ScoreEnum.SCORE_15 ? 'filled' : 'outlined'}
                    onClick={() => setActiveTab(ScoreEnum.SCORE_15)}
                  />
                  <Chip
                    label="KT 45'"
                    color="primary"
                    size={'small'}
                    variant={activeTab === ScoreEnum.SCORE_45 ? 'filled' : 'outlined'}
                    onClick={() => setActiveTab(ScoreEnum.SCORE_45)}
                  />
                  <Chip
                    label="Thi"
                    color="primary"
                    size={'small'}
                    variant={activeTab === ScoreEnum.SCORE_60 ? 'filled' : 'outlined'}
                    onClick={() => setActiveTab(ScoreEnum.SCORE_60)}
                  />
                </Box>
                <Box>
                  {assessments
                    .filter((assessment) => assessment.type === activeTab)
                    .map((assessment: Assessment) => {
                      return (
                        <ScoreForm
                          data={get(scoreBook, [`${activeTab}`, `${assessment.id}`], 0)}
                          assessment={assessment}
                          key={`${assessment.id}`}
                          onChangeData={handleChangeData(activeTab)}
                        />
                      )
                    })}
                </Box>
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
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ScoreBookPanelComponent

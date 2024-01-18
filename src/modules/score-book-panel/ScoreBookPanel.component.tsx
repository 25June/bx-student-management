import { Button, Typography, Drawer, Box, Chip } from '@mui/material'
import { get } from 'lodash'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import AddIcon from '@mui/icons-material/Add'
import React, { useState, useEffect, useCallback } from 'react'
import { getStudentScoreBook, setNewStudentScore } from 'services/scorebook'
import { useGetStudentById } from 'services/student'
import { fetchAssessments } from 'services/assessment'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useClassContext } from 'contexts/ClassContext'
import { useDialogContext } from 'contexts/DialogContext'
import { AssessmentActionType, DialogType, ScoreEnum } from 'constant/common'
import { initDefaultScoreBook } from 'constant/scorebook'
import { Assessment, ScoreBook } from 'models'
import SpiritScorecomponent from 'modules/score-book/SpiritScore.component'
import ScoreForm from 'modules/common/ScoreForm.component'
import { ImageBoxComponent } from 'modules/index'

interface Props {
  isOpen: boolean
  studentId: string
  onClose: () => void
}

const ScoreBookPanelComponent = ({ isOpen, studentId, onClose }: Props) => {
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
        fetchAssessments(classId, schoolYearId).then((res) => {
          setAssessments(res)
        })
      }, 100)
    }
    openDialog(
      DialogType.ASSESSMENT_DIALOG,
      AssessmentActionType.ADD_NEW_ASSESSMENT,
      null,
      assessmentCallBack
    )
  }, [openDialog, classId, setAssessments, schoolYearId])

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

  const listScore: number[] = assessments
    .filter((ass) => ass.type === activeTab)
    .map((ass) => {
      return get(scoreBook, [activeTab, ass.id], 0)
    })
  const average =
    listScore.length !== 0 ? listScore.reduce((a, b) => a + b, 0) / listScore.length : 0

  return (
    <Drawer
      variant="temporary"
      anchor={'right'}
      open={isOpen}
      onClose={onClose}
      sx={{ width: '100%', maxWidth: 350 }}
    >
      {studentInfo && (
        <Box pt={2} pr={2} pl={2} mb={5} key={studentId}>
          <Box display={'flex'} alignItems={'center'} mb={2}>
            <Chip
              color={'default'}
              size={'small'}
              icon={<KeyboardBackspaceIcon />}
              onClick={onClose}
              label="Trở về"
              variant="outlined"
            />
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
              <SpiritScorecomponent
                key={studentInfo.id + studentInfo.spiritScore || ''}
                studentId={studentInfo.id}
                spiritScore={studentInfo.spiritScore}
              />
            </Box>
            <Box>
              {scoreBook && (
                <>
                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}
                  >
                    <Chip
                      label="KT 5'"
                      color="info"
                      size={'small'}
                      variant={activeTab === ScoreEnum.SCORE_5 ? 'filled' : 'outlined'}
                      onClick={() => setActiveTab(ScoreEnum.SCORE_5)}
                    />
                    <Chip
                      label="KT 15'"
                      color="info"
                      size={'small'}
                      variant={activeTab === ScoreEnum.SCORE_15 ? 'filled' : 'outlined'}
                      onClick={() => setActiveTab(ScoreEnum.SCORE_15)}
                    />
                    <Chip
                      label="KT 45'"
                      color="info"
                      size={'small'}
                      variant={activeTab === ScoreEnum.SCORE_45 ? 'filled' : 'outlined'}
                      onClick={() => setActiveTab(ScoreEnum.SCORE_45)}
                    />
                    <Chip
                      label="Thi"
                      color="info"
                      size={'small'}
                      variant={activeTab === ScoreEnum.SCORE_60 ? 'filled' : 'outlined'}
                      onClick={() => setActiveTab(ScoreEnum.SCORE_60)}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'right', marginTop: 1 }}>
                    <Typography>
                      Điểm Trung Bình: <strong>{average.toFixed(2)}</strong>
                    </Typography>
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
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}

export default ScoreBookPanelComponent

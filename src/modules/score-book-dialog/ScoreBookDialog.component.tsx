import React from 'react'
import { StudentScoreBooks, Assessment } from 'models'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material'
import { useGetStudentScoreBook, useSetNewStudentScore } from 'services/scorebook'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import ScoreForm from '../common/ScoreForm.component'
import { groupAssessments } from 'modules/Table/helpers'

interface ScoreBookDialogComponentProps {
  data?: StudentScoreBooks | null
  onClose: () => void
  isOpen: boolean
}

const ScoreDetail = ({
  title,
  data,
  assessments,
  onChangeData,
}: {
  title: string
  data: Record<string, number>
  assessments: Assessment[]
  onChangeData: (submittedValue: { score: number }, assessmentId: string) => void
}) => {
  return (
    <Box mb={2}>
      <Typography>{title}</Typography>
      {assessments.map((assessment) => {
        return (
          <ScoreForm
            data={data[assessment.id]}
            assessment={assessment}
            key={`${assessment.id}_${data[assessment.id]}`}
            onChangeData={onChangeData}
          />
        )
      })}
    </Box>
  )
}

const ScoreBookDialogComponent = ({ data, onClose, isOpen }: ScoreBookDialogComponentProps) => {
  const { assessments } = useAssessmentContext()
  const setStudentScore = useSetNewStudentScore()
  const { studentScoreBook } = useGetStudentScoreBook(data?.id || '')
  const { showSnackbar } = useSnackbarContext()
  if (typeof assessments === 'undefined') {
    return null
  }

  const handleChangeData = (type: string) => (score: { score: number }, assessmentId: string) => {
    if (data?.id) {
      setStudentScore(data.id, type, score, assessmentId)
        .then(() => showSnackbar('Cập nhật thành công', 'success'))
        .catch(() => showSnackbar('Cập nhật thất bại', 'error'))
    }
  }
  const groupAssessment = groupAssessments(assessments)
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="scorebook-dialog-title">
      <DialogTitle id="scorebook-dialog-title">Cập nhật thông tin bài kiểm tra</DialogTitle>
      <DialogContent dividers={true}>
        <ScoreDetail
          title={'Kiểm tra 5 phút'}
          data={studentScoreBook?.score5 || {}}
          assessments={groupAssessment.score5}
          onChangeData={handleChangeData('score5')}
        />
        <ScoreDetail
          title={'Kiểm tra 15 phút'}
          data={studentScoreBook?.score15 || {}}
          assessments={groupAssessment.score15}
          onChangeData={handleChangeData('score15')}
        />
        <ScoreDetail
          title={'Kiểm tra 45 phút'}
          data={studentScoreBook?.score45 || {}}
          assessments={groupAssessment.score45}
          onChangeData={handleChangeData('score45')}
        />
        <ScoreDetail
          title={'Kiểm tra 60 phút'}
          data={studentScoreBook?.score60 || {}}
          assessments={groupAssessment.score60}
          onChangeData={handleChangeData('score60')}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        <Button onClick={onClose} variant="outlined" type={'button'} color={'neutral'}>
          Trở lại
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScoreBookDialogComponent

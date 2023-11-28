import React, { useEffect, useState } from 'react'
import { StudentScoreBook, Assessment, ScoreBook } from 'models'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material'
import { getStudentScoreBook, setNewStudentScore } from 'services/scorebook'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { initDefaultScoreBook } from 'constant/scorebook'
import ScoreForm from '../common/ScoreForm.component'
import { groupAssessments } from 'modules/Table/helpers'
import { useClassContext } from 'contexts/ClassContext'
import ClearIcon from '@mui/icons-material/Clear'

interface ScoreBookDialogComponentProps {
  data?: StudentScoreBook | null
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
  const { classId, semesterId, schoolYearId } = useClassContext()
  const { assessments } = useAssessmentContext()
  const { showSnackbar } = useSnackbarContext()
  const [studentScoreBook, setStudentScoreBook] = useState<ScoreBook>()

  const handleFetchStudentScoreBook = () => {
    if (data && data.id) {
      getStudentScoreBook({ classId, studentId: data.id, semesterId, schoolYearId })
        .then((value) => {
          if (value === 'EMPTY_DATA' && assessments?.length !== 0) {
            const initValue = initDefaultScoreBook(assessments)
            setStudentScoreBook({ ...initValue, id: data.id })
            return
          }
          setStudentScoreBook(value)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  useEffect(() => {
    if (data?.id) {
      handleFetchStudentScoreBook()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (typeof assessments === 'undefined') {
    return null
  }

  const handleChangeData = (type: string) => (score: { score: number }, assessmentId: string) => {
    if (data?.id) {
      setNewStudentScore({
        studentId: data.id,
        type,
        score: score.score,
        assessmentId,
        classId,
        semesterId,
        schoolYearId,
      })
        .then(() => {
          handleFetchStudentScoreBook()
          showSnackbar('Cập nhật 1 thành công', 'success')
        })
        .catch(() => showSnackbar('Cập nhật 1 thất bại', 'error'))
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
      <DialogActions sx={{ padding: '1rem 1.5rem', position: 'relative' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          type={'button'}
          color={'neutral'}
          startIcon={<ClearIcon />}
        >
          Trở lại
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScoreBookDialogComponent

import React from 'react'
import { StudentScoreBooks, Assessment } from 'models'
import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, Controller } from 'react-hook-form'
import { useGetAssessments } from 'services'
import { useGetStudentScoreBook, useSetNewStudentScore } from 'services/scorebook'
import { useSnackbarContext } from 'contexts/SnackbarContext'

interface ScoreBookDialogComponentProps {
  data?: StudentScoreBooks | null
  onClose: () => void
  isOpen: boolean
}

const ScoreForm = ({
  data,
  assessment,
  onChangeData,
}: {
  data: number
  assessment: Assessment
  onChangeData: (submittedValue: { score: number }, assessmentId: string) => void
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
    setError,
  } = useForm<{ score: number }>({
    defaultValues: data ? { score: data } : { score: 0 },
  })

  const onSubmit = (value: { score: number }) => {
    if (isNaN(Number(value.score)) || Number(value.score) > 10) {
      setError('score', { message: 'Invalid input' }, { shouldFocus: true })
      return
    }
    const submittedValue = {
      score: Number(value.score),
    }
    onChangeData(submittedValue, assessment.id)
    reset()
  }

  return (
    <Box display={'flex'} gap={1} flexWrap={'nowrap'} alignItems={'center'}>
      <Controller
        control={control}
        name={'score'}
        render={({ field }) => (
          <TextField
            id="outlined-lesson"
            label={assessment.bookDate}
            type="number"
            inputMode="numeric"
            margin="normal"
            fullWidth={true}
            helperText={errors.score?.message}
            error={!!errors.score}
            {...field}
          />
        )}
      />
      <Box>
        <IconButton
          aria-label="delete"
          color={'success'}
          sx={{ border: !isDirty ? 'none' : '1px solid #2e7d32', borderRadius: '5px', top: 5 }}
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty}
        >
          <CheckIcon />
        </IconButton>
      </Box>
      <Box>
        <IconButton
          aria-label="close"
          color={'error'}
          sx={{ border: !isDirty ? 'none' : '1px solid #d32f2f', borderRadius: '5px', top: 5 }}
          onClick={() => reset({ score: data })}
          disabled={!isDirty}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  )
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
  const { assessments, isLoading } = useGetAssessments()
  const setStudentScore = useSetNewStudentScore()
  const { studentScoreBook } = useGetStudentScoreBook(data?.id || '')
  console.log(studentScoreBook)
  const { showSnackbar } = useSnackbarContext()
  if (isLoading || typeof assessments === 'undefined') {
    return null
  }

  const handleChangeData = (type: string) => (score: { score: number }, assessmentId: string) => {
    if (data?.id) {
      setStudentScore(data.id, type, score, assessmentId)
        .then(() => showSnackbar('Cập nhật thành công', 'success'))
        .catch(() => showSnackbar('Cập nhật thất bại', 'error'))
    }
  }
  const groupAssessment = assessments.reduce(
    (acc, cur) => {
      switch (cur.type) {
        case 'KT5':
          return {
            ...acc,
            score5: [...acc.score5, cur],
          }
        case 'KT15':
          return {
            ...acc,
            score15: [...acc.score15, cur],
          }
        case 'KT45':
          return {
            ...acc,
            score45: [...acc.score45, cur],
          }
        case 'KT60':
          return {
            ...acc,
            score60: [...acc.score60, cur],
          }
      }
      return acc
    },
    {
      score5: [] as Assessment[],
      score15: [] as Assessment[],
      score45: [] as Assessment[],
      score60: [] as Assessment[],
    }
  )
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">Cập nhật thông tin bài kiểm tra</DialogTitle>
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
        <Button onClick={onClose} variant="outlined" type={'button'}>
          Trở lại
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScoreBookDialogComponent

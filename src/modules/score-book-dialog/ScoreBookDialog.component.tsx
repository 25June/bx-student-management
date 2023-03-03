import React from 'react'
import { Score, StudentScoreBooks, Assessment } from 'models'
import { ScoreBookActionType } from 'constant'
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

interface ScoreBookDialogComponentProps {
  data?: StudentScoreBooks | null
  action: string
  onSave: (
    data: StudentScoreBooks | Omit<ScoreBookActionType, 'id'>,
    action: ScoreBookActionType
  ) => void
  onClose: () => void
  isOpen: boolean
}

const ScoreForm = ({ data, assessment }: { data: Score; assessment: Assessment }) => {
  const { handleSubmit, control, reset } = useForm<{ score: number }>({
    defaultValues: data.score ? { score: data.score } : { score: 0 },
  })

  const onSubmit = (value: { score: number }) => {
    console.log({ assessment })
    console.log(value)
  }

  return (
    <Box display={'flex'} gap={1} flexWrap={'nowrap'} alignItems={'center'}>
      <Controller
        control={control}
        name={'score'}
        render={({ field }) => (
          <TextField
            id="outlined-lesson"
            label={data.bookDate}
            type="number"
            inputMode="numeric"
            margin="normal"
            fullWidth={true}
            {...field}
          />
        )}
      />
      <Box>
        <IconButton
          aria-label="delete"
          color={'success'}
          sx={{ border: '1px solid #2e7d32', borderRadius: '5px', top: 5 }}
          onClick={handleSubmit(onSubmit)}
        >
          <CheckIcon />
        </IconButton>
      </Box>
      <Box>
        <IconButton
          aria-label="close"
          color={'error'}
          sx={{ border: '1px solid #d32f2f', borderRadius: '5px', top: 5 }}
          onClick={() => reset({ score: data.score })}
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
}: {
  title: string
  data: Record<string, Score>
  assessments: Assessment[]
}) => {
  return (
    <Box mb={2}>
      <Typography>{title}</Typography>
      {assessments.map((assessment) => {
        let studentScore = Object.values(data).find(
          (score) => score.bookDate === assessment.bookDate
        )
        if (typeof studentScore === 'undefined') {
          studentScore = {
            bookDate: assessment.bookDate,
            score: 0,
          } as Score
        }
        return <ScoreForm data={studentScore} assessment={assessment} key={assessment.id} />
      })}
    </Box>
  )
}

const ScoreBookDialogComponent = ({ data, onClose, isOpen }: ScoreBookDialogComponentProps) => {
  const { assessments, isLoading } = useGetAssessments()
  if (isLoading || typeof assessments === 'undefined') {
    return null
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
          data={data?.score5 || {}}
          assessments={groupAssessment.score5}
        />
        <ScoreDetail
          title={'Kiểm tra 15 phút'}
          data={data?.score15 || {}}
          assessments={groupAssessment.score15}
        />
        <ScoreDetail
          title={'Kiểm tra 45 phút'}
          data={data?.score45 || {}}
          assessments={groupAssessment.score45}
        />
        <ScoreDetail
          title={'Kiểm tra 60 phút'}
          data={data?.score60 || {}}
          assessments={groupAssessment.score60}
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

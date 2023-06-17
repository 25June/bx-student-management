import { Assessment } from 'models'
import { Controller, useForm } from 'react-hook-form'
import { Box, IconButton, TextField } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'
import { useIsMobile } from 'utils/common'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'

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
  const isMobile = useIsMobile()

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
            label={assessment.bookDate ? formatYYYMMDDToDDMMYYYY(assessment.bookDate) : ''}
            type="number"
            inputMode="numeric"
            margin="normal"
            fullWidth={true}
            helperText={errors.score?.message}
            error={!!errors.score}
            size={isMobile ? 'small' : 'medium'}
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
          size={isMobile ? 'small' : 'medium'}
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
          size={isMobile ? 'small' : 'medium'}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ScoreForm

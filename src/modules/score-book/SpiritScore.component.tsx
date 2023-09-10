import { Box, TextField, IconButton } from '@mui/material'
import { updateSpiritScore } from 'services/student'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useClassContext } from 'contexts/ClassContext'
import { useEffect } from 'react'

interface Props {
  studentId: string
  spiritScore?: number
}

const SpiritScorecomponent = ({ studentId, spiritScore }: Props) => {
  const { showSnackbar } = useSnackbarContext()
  const { classId } = useClassContext()
  const { fetchStudents } = useStudentContext()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors },
    setError,
    setValue,

  } = useForm<{ score: number }>({
    defaultValues: spiritScore ? { score: spiritScore } : { score: 0 },
  })

  useEffect(() => {
    if (spiritScore) {
      setValue('score', spiritScore)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spiritScore])

  const onSubmit = (value: { score: number }) => {
    if (isNaN(Number(value.score)) || Number(value.score) > 10) {
      setError('score', { message: 'Invalid input' }, { shouldFocus: true })
      return
    }

    return updateSpiritScore(studentId, Number(value.score)).then(() => {
      showSnackbar(
        `Cập Nhật Thành Công`,
        'success'
      )
    }).catch((error: any) => {
      console.error(error)
      showSnackbar(
        `Cập Nhật Thất Bại`,
        'error'
      )
    }).finally(() => {
      fetchStudents(classId)
    })
  }
  return (<Box display={'flex'} gap={1} flexWrap={'nowrap'} alignItems={'center'}>
    <Controller
      control={control}
      name={'score'}
      render={({ field }) => (
        <TextField
          id="outlined-lesson"
          label={'Điểm cộng'}
          type="number"
          inputMode="decimal"
          margin="normal"
          fullWidth={true}
          helperText={errors.score?.message}
          error={!!errors.score}
          size={'small'}
          sx={{ width: '100%' }}
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
        size={'small'}
      >
        <CheckIcon />
      </IconButton>
    </Box>
    <Box>
      <IconButton
        aria-label="close"
        color={'error'}
        sx={{ border: !isDirty ? 'none' : '1px solid #d32f2f', borderRadius: '5px', top: 5 }}
        onClick={() => reset({ score: spiritScore })}
        disabled={!isDirty}
        size={'small'}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  </Box>
  )
}

export default SpiritScorecomponent

import React, { useEffect } from 'react'
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { AssessmentActionType } from 'constant'
import { Controller, useForm } from 'react-hook-form'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Assessment } from 'models/assessment'
import { getToday } from 'utils'

type AssessmentForm = {
  bookDate: string
  type: string
  lesson: string
}

const AssessmentFormDefaultValue = (data: Assessment | null) => {
  if (data) {
    return {
      bookDate: data.bookDate,
      type: data.type,
      lesson: data.lesson,
    }
  }

  return {
    bookDate: getToday(),
    type: 'KT5',
    lesson: '',
  }
}

interface AssessmentDialogComponentProps {
  data: Assessment | null
  action: string
  onSave: (data: Assessment | Omit<Assessment, 'id'>, action: AssessmentActionType) => void
  onClose: () => void
  isOpen: boolean
}

const getButtonColor = (type: string): ButtonProps['color'] => {
  if (type === AssessmentActionType.ADD_NEW_ASSESSMENT) {
    return 'primary'
  }
  if (type === AssessmentActionType.EDIT_ASSESSMENT) {
    return 'warning'
  }
  return 'error'
}

const AssessmentDialogComponent = ({
  data,
  action,
  onSave,
  onClose,
  isOpen,
}: AssessmentDialogComponentProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const { handleSubmit, control, reset } = useForm<AssessmentForm>({
    defaultValues: AssessmentFormDefaultValue(data),
  })
  useEffect(() => {
    // if (data && data.id) {
    //   setValue('bookDate', data.bookDate)
    //   setValue('type', data.type)
    // }
    return () => reset()
  }, [reset])

  const onSubmit = async (submitData: AssessmentForm) => {
    if (action === AssessmentActionType.EDIT_ASSESSMENT && data?.id) {
      const updatedAssessment: Assessment = {
        id: data.id,
        classId: '', // TODO Auto Add class by normal user create
        bookDate: submitData.bookDate,
        type: submitData.type,
        lesson: submitData.lesson,
      }
      onSave(updatedAssessment, AssessmentActionType.EDIT_ASSESSMENT)
      onClose()
      return
    }
    if (data?.id) {
      onSave(data, AssessmentActionType.DELETE_ASSESSMENT)
      onClose()
      return
    }
    const newAssessment: Omit<Assessment, 'id'> = {
      classId: '', // TODO Auto Add class by normal user create
      bookDate: submitData.bookDate,
      type: submitData.type,
      lesson: submitData.lesson,
    }
    onSave(newAssessment, AssessmentActionType.ADD_NEW_ASSESSMENT)
    onClose()
    return
  }
  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {action === AssessmentActionType.EDIT_ASSESSMENT && 'Cập nhật thông tin bài kiểm tra'}
        {action === AssessmentActionType.ADD_NEW_ASSESSMENT && 'Thêm thông tin bài kiểm tra'}
        {action === AssessmentActionType.DELETE_ASSESSMENT && 'Xoá thông tin bài kiểm tra'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers={true}>
          {action === AssessmentActionType.DELETE_ASSESSMENT && data?.id ? (
            <DialogContentText>
              {`Bạn có chắc chắn muốn xoá thông tin bài kiểm tra ${data.type} vào ngày ${data.bookDate}`}
            </DialogContentText>
          ) : (
            <Box>
              <Controller
                control={control}
                name={'lesson'}
                render={({ field }) => (
                  <TextField
                    id="outlined-lesson"
                    label="Bài kiểm tra"
                    type="text"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name={'type'}
                render={({ field }) => (
                  <TextField
                    id="outlined-type"
                    label="Loại bài kiểm tra"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name={'bookDate'}
                render={({ field }) => (
                  <TextField
                    id="outlined-bookDate"
                    label="Ngày làm bài"
                    type="date"
                    helperText="Ngày / Tháng / Năm"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
          <Button onClick={onClose} variant="outlined" type={'button'}>
            Huỷ
          </Button>
          <Button variant="contained" color={getButtonColor(action)} type={'submit'}>
            {action === AssessmentActionType.DELETE_ASSESSMENT ? 'Xoá' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AssessmentDialogComponent

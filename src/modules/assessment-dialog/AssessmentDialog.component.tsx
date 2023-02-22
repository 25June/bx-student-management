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

type AssessmentForm = {
  createdDate: number
  type: string
}

const AssessmentFormDefaultValue = {
  createdDate: Date.now(),
  type: 'KT5',
}

interface AssessmentDialogComponentProps {
  data: Assessment | null
  action: string
  onSave: (data: Assessment | Omit<Assessment, 'id'> | string, action: AssessmentActionType) => void
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

  const { handleSubmit, control, setValue, reset } = useForm<AssessmentForm>({
    defaultValues: AssessmentFormDefaultValue,
  })
  useEffect(() => {
    if (data && data.id) {
      setValue('createdDate', data.createdDate)
      setValue('type', data.type)
    }
    return () => reset()
  }, [action, data, reset, setValue])

  const onSubmit = async (submitData: AssessmentForm) => {
    if (action === AssessmentActionType.EDIT_ASSESSMENT && data?.id) {
      const updatedAssessment: Assessment = {
        id: data.id,
        classId: '', // TODO Auto Add class by normal user create
        createdDate: submitData.createdDate,
        type: submitData.type,
      }
      onSave(updatedAssessment, AssessmentActionType.EDIT_ASSESSMENT)
      onClose()
      return
    }
    if (data?.id) {
      onSave(data.id, AssessmentActionType.DELETE_ASSESSMENT)
    }
    const newAssessment: Omit<Assessment, 'id'> = {
      classId: '', // TODO Auto Add class by normal user create
      createdDate: submitData.createdDate,
      type: submitData.type,
    }
    onSave(newAssessment, AssessmentActionType.ADD_NEW_ASSESSMENT)
    onClose()
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
      <DialogContent dividers={true}>
        {action === AssessmentActionType.DELETE_ASSESSMENT && data?.id ? (
          <DialogContentText>
            {`Bạn có chắc chắn muốn xoá thông tin bài kiểm tra ${data.type} vào ngày ${new Date(
              data.createdDate
            ).toDateString()}`}
          </DialogContentText>
        ) : (
          <>
            <form onSubmit={handleSubmit((value) => console.log(value))}>
              <Box display={'flex'} justifyContent={'space-between'} gap={1}>
                <Controller
                  control={control}
                  name={'createdDate'}
                  render={({ field }) => (
                    <TextField
                      id="outlined-createdDate"
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
              </Box>
            </form>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        <Button autoFocus={true} onClick={onClose} variant="outlined">
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={getButtonColor(action)}
        >
          {action === AssessmentActionType.DELETE_ASSESSMENT ? 'Xoá' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssessmentDialogComponent

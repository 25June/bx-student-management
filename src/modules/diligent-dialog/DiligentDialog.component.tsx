import React, { useEffect } from 'react'
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { StudentActionType } from 'constant'
import { DiligentActionType } from 'constant/common'

interface DiligentDialogComponentProps {
  onClose: () => void
  isOpen: boolean
  action: string
  studyDate?: string
}

const DiligentDialogComponent = ({
  onClose,
  isOpen,
  action,
  studyDate,
}: DiligentDialogComponentProps) => {
  const { handleSubmit, control, setValue } = useForm<{ studyDate: string }>()
  useEffect(() => {
    if (studyDate) {
      setValue('studyDate', studyDate)
    }
  }, [studyDate, setValue])
  const onSubmit = (data: { studyDate: string }) => {
    console.log(data)
  }
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="diligent-dialog-title">
      <DialogTitle id="diligent-dialog-title">Thêm Ngày Điểm Danh</DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'studyDate'}
          render={({ field }) => (
            <TextField
              id="outlined-studyDate"
              label="Ngày Điểm Danh"
              type="date"
              helperText="Ngay/Thang/Nam"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              {...field}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        <Button onClick={onClose} variant="outlined" type={'button'}>
          Trở lại
        </Button>
        <Button
          type={'button'}
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={action === StudentActionType.EDIT_STUDENT ? 'warning' : 'primary'}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DiligentDialogComponent

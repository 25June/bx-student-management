import React, { useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { updateNoteAttendance } from 'services/diligent'
import { useClassContext } from 'contexts/ClassContext'
import { useSnackbarContext } from 'contexts/SnackbarContext'

interface NoteDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
  note: string
  rollCallDateId: string
  studentId: string
}

const NoteDialogComponent = ({
  onClose,
  isOpen,
  note,
  rollCallDateId,
  studentId,
}: NoteDialogComponentProps) => {
  const { classId } = useClassContext()
  const { showSnackbar } = useSnackbarContext()
  const { handleSubmit, control } = useForm<{ note: string }>({
    defaultValues: { note: note || '' },
  })
  const [isLoading, setLoading] = useState<boolean>(false)

  const onSubmit = (data: { note: string }) => {
    setLoading(true)
    updateNoteAttendance({
      rollDateId: rollCallDateId,
      studentId,
      note: data.note,
      classId,
    })
      .then(() => {
        showSnackbar('Ghi chú đã được lưu', 'success')
      })
      .catch(() => {
        showSnackbar('Ghi chú chưa được lưu', 'error')
      })
      .finally(() => {
        Promise.resolve().then(() => {
          setLoading(false)
          onClose(false)
        })
      })
  }
  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="diligent-dialog-title">
      <DialogTitle id="diligent-dialog-title">Ghi Chú</DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'note'}
          render={({ field, fieldState }) => (
            <TextField
              id="outlined-studyDate"
              label="Ghi Chú"
              type="text"
              helperText={'Vắng có phép với lý do gì mình sẽ ghi ở đây hehe'}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              error={!!fieldState.error}
              {...field}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          type={'button'}
          startIcon={<ClearIcon />}
          color={'neutral'}
          disabled={isLoading}
        >
          Huỷ
        </Button>
        <Button
          type={'button'}
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={'primary'}
          startIcon={isLoading ? <CircularProgress size={'1rem'} /> : <CheckIcon />}
          disabled={isLoading}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NoteDialogComponent

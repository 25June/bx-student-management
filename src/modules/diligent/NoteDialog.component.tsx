import React, { useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { updateNoteAttendance } from 'services/diligent'
import { useClassContext } from 'contexts/ClassContext'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { NoteForm } from 'models/diligent'

interface Props {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
  rollCallDateId: string
  studentId: string
  data: NoteForm
}

const NoteDialogComponent = ({ onClose, isOpen, data, rollCallDateId, studentId }: Props) => {
  const { classId, schoolYearId, semesterId } = useClassContext()
  const { showSnackbar } = useSnackbarContext()
  const { handleSubmit, control, setValue, watch } = useForm<NoteForm>({
    defaultValues: { ...data },
  })

  const [isLoading, setLoading] = useState<boolean>(false)

  const onSubmit = (data: NoteForm) => {
    setLoading(true)
    updateNoteAttendance({
      rollDateId: rollCallDateId,
      studentId,
      data,
      classId,
      schoolYearId,
      semesterId,
    })
      .then(() => {
        showSnackbar('Ghi chú đã được lưu', 'success')
      })
      .catch(() => {
        showSnackbar('Ghi chú chưa được lưu', 'error')
      })
      .finally(() => {
        setLoading(false)
        onClose(false)
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <FormControlLabel
            control={
              <Checkbox
                sx={{ padding: 0.5 }}
                size={'small'}
                checked={watch('adoration')}
                onChange={(event) => {
                  setValue('adoration', event.target.checked)
                }}
              />
            }
            label="Chầu Thánh Thể"
            sx={{ margin: 0, fontSize: '0.825rem' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={{ padding: 0.5 }}
                size={'small'}
                checked={watch('givingNotice')}
                onChange={(event) => {
                  setValue('givingNotice', event.target.checked)
                }}
              />
            }
            label="Vắng có phép"
            sx={{ margin: 0, fontSize: '0.825rem' }}
          />
        </Box>
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

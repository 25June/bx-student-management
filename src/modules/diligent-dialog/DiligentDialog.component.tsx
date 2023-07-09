import React, { useEffect } from 'react'
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useAddRollCallDate, useUpdateRollCallDate } from 'services/diligent'
import { formatDisplayInput } from 'utils/datetime'
import { RollCallDateActionType } from 'constant/common'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useClassContext } from 'contexts/ClassContext'
import { useDiligentContext } from 'contexts/DiligentContext'

interface DiligentDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
  action: string
  rollCall?: {
    id: string
    date: string
  }
}

const DiligentDialogComponent = ({
  onClose,
  isOpen,
  action,
  rollCall,
}: DiligentDialogComponentProps) => {
  const { handleSubmit, control, setValue } = useForm<{ rollCallDate: string }>({
    defaultValues: { rollCallDate: rollCall?.date || formatDisplayInput(new Date()) },
  })
  const addRollCallDate = useAddRollCallDate()
  const updateRollCallDate = useUpdateRollCallDate()
  const { classId } = useClassContext()
  const { fetchRollCallDates } = useDiligentContext()

  useEffect(() => {
    if (rollCall && rollCall.date) {
      setValue('rollCallDate', rollCall.date)
    }
  }, [rollCall, setValue])

  const onSubmit = ({ rollCallDate }: { rollCallDate: string }) => {
    if (action === RollCallDateActionType.EDIT_STUDY_DATE) {
      updateRollCallDate({ date: rollCallDate, id: rollCall?.id || '', classId }).finally(() =>
        onClose(true)
      )
      return
    }
    addRollCallDate({ date: rollCallDate, classId }).finally(() => {
      onClose(true)
      return fetchRollCallDates?.({ classId })
    })
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="diligent-dialog-title">
      <DialogTitle id="diligent-dialog-title">Thêm Ngày Điểm Danh</DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'rollCallDate'}
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
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          type={'button'}
          startIcon={<ClearIcon />}
          color={'neutral'}
        >
          Huỷ
        </Button>
        <Button
          type={'button'}
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={action === RollCallDateActionType.EDIT_STUDY_DATE ? 'warning' : 'primary'}
          startIcon={<CheckIcon />}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DiligentDialogComponent

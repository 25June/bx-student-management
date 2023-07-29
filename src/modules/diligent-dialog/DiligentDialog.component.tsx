import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { addRollCallDate, updateRollCallDate } from 'services/diligent'
import { formatDisplayInput } from 'utils/datetime'
import { RollCallDateActionType } from 'constant/common'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useClassContext } from 'contexts/ClassContext'
import { useDiligentContext } from 'contexts/DiligentContext'

interface DiligentDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
  action: RollCallDateActionType
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
  const { handleSubmit, control, setValue, setError } = useForm<{ rollCallDate: string }>({
    defaultValues: { rollCallDate: rollCall?.date || formatDisplayInput(new Date()) },
  })
  const [isLoading, setLoading] = useState<boolean>(false)
  const { classId, semesterId, schoolYearId } = useClassContext()

  const { fetchRollCallDates, rollCallDates } = useDiligentContext()

  useEffect(() => {
    if (rollCall && rollCall.date) {
      setValue('rollCallDate', rollCall.date)
    }
  }, [rollCall, setValue])

  const onSubmit = ({ rollCallDate }: { rollCallDate: string }) => {
    setLoading(true)
    if (Object.values(rollCallDates || {}).includes(rollCallDate)) {
      setError('rollCallDate', { message: 'Ngày bạn định thêm đã có rồi!' }, { shouldFocus: true })
      return
    }

    if (action === RollCallDateActionType.EDIT_STUDY_DATE) {
      updateRollCallDate({
        date: rollCallDate,
        id: rollCall?.id || '',
        classId,
        semesterId,
        schoolYearId,
      }).finally(() => {
        setTimeout(() => {
          setLoading(false)
          onClose(true)
        }, 20)
        return fetchRollCallDates?.({ classId, semesterId, schoolYearId })
      })
      return
    }

    addRollCallDate({ date: rollCallDate, classId, semesterId, schoolYearId }).finally(() => {
      setTimeout(() => {
        setLoading(false)
        onClose(true)
      }, 20)
      return fetchRollCallDates?.({ classId, semesterId, schoolYearId })
    })
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="diligent-dialog-title">
      <DialogTitle id="diligent-dialog-title">
        {action === RollCallDateActionType.EDIT_STUDY_DATE
          ? 'Sửa Ngày Điểm Danh'
          : 'Thêm Ngày Điểm Danh'}
      </DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'rollCallDate'}
          render={({ field, fieldState }) => (
            <TextField
              id="outlined-studyDate"
              label="Ngày Điểm Danh"
              type="date"
              helperText={fieldState.error ? fieldState.error.message : 'Ngay/Thang/Nam'}
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
          color={action === RollCallDateActionType.EDIT_STUDY_DATE ? 'warning' : 'primary'}
          startIcon={isLoading ? <CircularProgress size={'1rem'} /> : <CheckIcon />}
          disabled={isLoading}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DiligentDialogComponent

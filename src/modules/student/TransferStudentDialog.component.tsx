import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useUpdateStudent } from 'services/student'
import { Student } from 'models/student'
import { Class } from 'models/class'
import { BaseClasses } from 'constant/common'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'

interface TransferForm {
  class: Class
  standStill: boolean
}

interface TransferStudentDialogProps {
  student: Student
  isOpen: boolean
  onClose: () => void
}

const TransferStudentDialogComponent = ({
  student,
  isOpen,
  onClose,
}: TransferStudentDialogProps) => {
  const updateStudent = useUpdateStudent()

  const { showSnackbar } = useSnackbarContext()
  const { handleSubmit, setValue, reset, watch } = useForm<TransferForm>({
    defaultValues: {
      class: student.class || BaseClasses[0],
      standStill: false,
    },
  })
  const selectedClass = watch('class')
  const [isLoading, setLoading] = useState<boolean>(false)
  const onSubmit = async (data: TransferForm) => {
    setLoading(true)
    let status: string[] = []
    if (student.transferHistory) {
      if (data.standStill) {
        status = ['standStill', ...student.transferHistory]
      }
      if (student.class?.name) {
        status = [student.class.name, ...student.transferHistory]
      }
    } else {
      if (data.standStill) {
        status = ['standStill']
      }
      if (student.class?.name) {
        status = [student.class.name]
      }
    }
    const updatedStudent: Student = {
      ...student,
      class: data.class,
      transferHistory: status,
    }
    return updateStudent({
      dataInput: updatedStudent,
      onSuccess: () =>
        showSnackbar(
          `Chuyển Em ${student.lastName} ${student.firstName} Lên Lớp ${data.class.name} Thành Công`,
          'success'
        ),
      onError: () =>
        showSnackbar(
          `Chuyển Em ${student.lastName} ${student.firstName} Lên Lớp ${data.class.name} Thất Bại`,
          'error'
        ),
      onComplete: () => {
        setLoading(false)
        reset()
        Promise.resolve().then(() => onClose())
      },
    })
  }

  const handleChangeClass = (event: SelectChangeEvent) => {
    setValue(
      'class',
      BaseClasses.find((c: Class) => c.id === (event.target.value as string)) || BaseClasses[0]
    )
  }
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Chuyển lớp cho em {student.lastName} {student.firstName}
      </DialogTitle>
      <DialogContent dividers={true} sx={{ margin: '1rem 0' }}>
        <ClassDropdownComponent onChangeClass={handleChangeClass} classObj={selectedClass} />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!watch('standStill')}
              onChange={(event: ChangeEvent<any>) => {
                setValue('standStill', event.target.checked)
              }}
            />
          }
          label="Học lại"
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus={true}
          onClick={onClose}
          variant="outlined"
          color={'neutral'}
          disabled={isLoading}
          startIcon={<ClearIcon />}
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
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransferStudentDialogComponent

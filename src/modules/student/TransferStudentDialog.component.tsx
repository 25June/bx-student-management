import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useUpdateStudent } from 'services'
import { Class, Student } from 'models'
import { SelectChangeEvent } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'

interface TransferForm {
  class: Class
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
    },
  })
  const selectedClass = watch('class')
  const [isLoading, setLoading] = useState<boolean>(false)
  const onSubmit = async (data: TransferForm) => {
    setLoading(true)
    const updatedStudent: Student = {
      ...student,
      class: data.class,
      transferHistory: student.transferHistory
        ? [student.class?.name || '', ...student.transferHistory]
        : [student.class?.name || ''],
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

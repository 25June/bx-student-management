import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Box,
  ButtonProps,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import { splitFullName } from 'utils'

interface StudentDialogComponentProps {
  isOpen: boolean
  onClose: () => void
  actionType: string
  onSave: (data: Omit<Student, 'id'>) => void
  actionData?: Student | null
}

type Phone = {
  name: string
  number: string
}

type StudentForm = {
  saintName: string
  fullName: string
  birthday: string
  address: string
  grade: string
  phone1: Phone
  phone2: Phone
}

const StudentDefaultValue = {
  saintName: '',
  fullName: '',
  birthday: '',
  address: '',
  grade: '1',
  phone1: {
    name: '',
    number: '',
  },
  phone2: {
    name: '',
    number: '',
  },
}

const getButtonColor = (type: string): ButtonProps['color'] => {
  if (type === StudentActionType.ADD_NEW_STUDENT) {
    return 'primary'
  }
  if (type === StudentActionType.EDIT_STUDENT) {
    return 'warning'
  }
  return 'error'
}

const StudentDialogComponent = ({
  isOpen,
  onClose,
  actionType,
  onSave,
  actionData,
}: StudentDialogComponentProps) => {
  const theme = useTheme()
  const { handleSubmit, control, setValue, reset } = useForm<StudentForm>({
    defaultValues: StudentDefaultValue,
  })
  useEffect(() => {
    if (actionType !== StudentActionType.ADD_NEW_STUDENT && actionData) {
      console.log(actionData)
      setValue('saintName', actionData.saintName)
      setValue('fullName', `${actionData.lastName} ${actionData.firstName}`)
      setValue('birthday', actionData.birthday)
      setValue('address', actionData.address)
      setValue('grade', actionData.grade)
      setValue('phone1', actionData.phones[0])
      setValue('phone2', actionData.phones[1])
    }
    return () => reset()
  }, [actionType, actionData, reset, setValue])
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const onSubmit = (data: StudentForm) => {
    const { firstName, lastName } = splitFullName(data.fullName)
    if (actionType !== StudentActionType.ADD_NEW_STUDENT && actionData) {
      const student: Student = {
        id: actionData.id,
        saintName: data.saintName,
        firstName,
        lastName,
        birthday: data.birthday,
        address: data.address,
        grade: data.grade.toString(),
        phones: [data.phone1, data.phone2],
      }
      onSave(student)
    } else {
      const student: Omit<Student, 'id'> = {
        saintName: data.saintName,
        firstName,
        lastName,
        birthday: data.birthday,
        address: data.address,
        grade: data.grade.toString(),
        phones: [data.phone1, data.phone2],
      }
      onSave(student)
    }
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
        {actionType === StudentActionType.EDIT_STUDENT && 'Cập nhật thông tin thiếu nhi'}
        {actionType === StudentActionType.ADD_NEW_STUDENT && 'Thêm thông tin thiếu nhi'}
        {actionType === StudentActionType.DELETE_STUDENT && 'Xoá thông tin thiếu nhi'}
      </DialogTitle>
      <DialogContent dividers={true}>
        {actionType === StudentActionType.DELETE_STUDENT && actionData ? (
          <DialogContentText>
            {`Bạn có chắc chắn muốn xoá thông tin thiếu nhi ${actionData.lastName} ${actionData.firstName}`}
          </DialogContentText>
        ) : (
          <>
            <DialogContentText>Xin dien vao nhung o trong duoi day!</DialogContentText>
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <Controller
                rules={{ required: true }}
                control={control}
                name={'saintName'}
                render={({ field }) => (
                  <TextField
                    id="outlined-SaintName"
                    label="Ten Thanh"
                    helperText="Ex: Maria, Giuse, Anna"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Controller
                rules={{ required: true }}
                control={control}
                name={'fullName'}
                render={({ field }) => (
                  <TextField
                    id="outlined-FullName"
                    label="Ho va Ten"
                    helperText="Ex: Nguyen Van A"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name={'birthday'}
                  render={({ field }) => (
                    <TextField
                      id="outlined-Birthday"
                      label="Ngay Sinh"
                      type="date"
                      helperText="Ngay/Thang/Nam"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      fullWidth={true}
                      {...field}
                    />
                  )}
                />
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name={'grade'}
                  render={({ field }) => (
                    <TextField
                      sx={{ marginLeft: 1 }}
                      id="outlined-Grade"
                      label="Lop"
                      helperText="Ex: 1, 2, 3, 4, 5"
                      margin="normal"
                      type="string"
                      InputLabelProps={{ shrink: true }}
                      fullWidth={true}
                      {...field}
                    />
                  )}
                />
              </Box>
              <Controller
                rules={{ required: true }}
                control={control}
                name={'address'}
                render={({ field }) => (
                  <TextField
                    id="outlined-Address"
                    label="Dia Chi"
                    helperText="Ex: 231/83/13T Duong Ba Trac, p1, q8"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Controller
                  control={control}
                  name={'phone1.name'}
                  render={({ field }) => (
                    <TextField
                      id={`outlined-name-phone1`}
                      label="Tên"
                      helperText="Ex: Cha"
                      margin="normal"
                      type="text"
                      fullWidth={true}
                      InputLabelProps={{ shrink: true }}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={'phone1.number'}
                  render={({ field }) => (
                    <TextField
                      sx={{ marginLeft: 1 }}
                      id={`outlined-number-phone1`}
                      label="Sdt"
                      helperText="Ex: 0973173484"
                      margin="normal"
                      type="number"
                      fullWidth={true}
                      InputLabelProps={{ shrink: true }}
                      {...field}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name={'phone2.name'}
                  render={({ field }) => (
                    <TextField
                      id={`outlined-name-phone2`}
                      label="Tên"
                      helperText="Ex: Mẹ"
                      margin="normal"
                      type="text"
                      fullWidth={true}
                      InputLabelProps={{ shrink: true }}
                      {...field}
                    />
                  )}
                />
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name={'phone2.number'}
                  render={({ field }) => (
                    <TextField
                      sx={{ marginLeft: 1 }}
                      id={`outlined-number-phone2`}
                      label="Sdt"
                      helperText="Ex: 0973173484"
                      margin="normal"
                      type="number"
                      fullWidth={true}
                      InputLabelProps={{ shrink: true }}
                      {...field}
                    />
                  )}
                />
              </Box>
            </form>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button autoFocus={true} onClick={onClose} variant="outlined">
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={getButtonColor(actionType)}
        >
          {actionType === StudentActionType.DELETE_STUDENT ? 'Xoá' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StudentDialogComponent

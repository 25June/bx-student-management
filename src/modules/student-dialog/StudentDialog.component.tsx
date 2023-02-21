import React, { useEffect, useState } from 'react'
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
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { StudentActionType } from 'constant'
import { Student } from 'models'
import { splitFullName } from 'utils'
import { formatDate, formatPhoneWithoutDot, formatPhone } from 'utils/formatDataForTable'
import { removeImage, uploadAvatar } from 'services'
import { ImageBoxComponent, LinearProgressComponent } from 'modules'

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
  gender: boolean
  avatar?: File | null
  avatarPath?: string
}

const StudentDefaultValue = {
  saintName: '',
  fullName: '',
  birthday: '',
  address: '',
  grade: '1',
  gender: false,
  phone1: {
    name: '',
    number: '',
  },
  phone2: {
    name: '',
    number: '',
  },
  avatar: null,
  avatarPath: '',
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
  const { handleSubmit, control, setValue, reset, formState } = useForm<StudentForm>({
    defaultValues: StudentDefaultValue,
  })
  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0)
  useEffect(() => {
    if (actionType !== StudentActionType.ADD_NEW_STUDENT && actionData) {
      setValue('saintName', actionData.saintName)
      setValue('fullName', `${actionData.lastName} ${actionData.firstName}`)
      setValue('birthday', formatDate(actionData.birthday, false))
      setValue('address', actionData.address)
      setValue('gender', !!actionData.gender)
      setValue('grade', actionData.grade)
      setValue('phone1', {
        ...actionData.phones[0],
        number: formatPhoneWithoutDot(actionData.phones[0].number),
      })
      setValue('phone2', {
        ...actionData.phones[1],
        number: formatPhoneWithoutDot(actionData.phones[1].number),
      })
      setValue('avatarPath', actionData.avatarPath)
    }
    return () => reset()
  }, [actionType, actionData, reset, setValue])
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const onSubmit = async (data: StudentForm) => {
    let downloadPath
    const { firstName, lastName } = splitFullName(data.fullName)
    if (data.avatar) {
      // do upload file
      downloadPath = await uploadAvatar(data.avatar, setUploadImageProgress)
      console.log({ downloadPath })
    }
    if (actionType !== StudentActionType.ADD_NEW_STUDENT && actionData) {
      const updatedStudent: Student = {
        id: actionData.id,
        saintName: data.saintName,
        firstName,
        lastName,
        birthday: formatDate(data.birthday, true),
        address: data.address,
        grade: data.grade,
        phones: [
          { ...data.phone1, number: formatPhone(data.phone1.number) },
          { ...data.phone2, number: formatPhone(data.phone2.number) },
        ],
        gender: data.gender,
        avatarPath: downloadPath || data.avatarPath,
      }
      onSave(updatedStudent)
      setUploadImageProgress(0)
      onClose()
      if (downloadPath && data.avatarPath) {
        removeImage(data.avatarPath)
      }
      return
    }
    const newStudent: Omit<Student, 'id'> = {
      saintName: data.saintName,
      firstName,
      lastName,
      birthday: formatDate(data.birthday, true),
      address: data.address,
      grade: data.grade,
      phones: [
        { ...data.phone1, number: formatPhone(data.phone1.number) },
        { ...data.phone2, number: formatPhone(data.phone2.number) },
      ],
      gender: data.gender,
      avatarPath: downloadPath || undefined,
    }
    onSave(newStudent)
    setUploadImageProgress(0)
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
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <Box>
                <TextField
                  sx={{ maxWidth: '100%' }}
                  id="outlined-avatar"
                  label="Ảnh đại diện"
                  helperText="Chỉ upload ảnh .jpg, .png"
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  fullWidth={true}
                  type={'file'}
                />

                {actionData?.avatarPath && (
                  <Box textAlign={'center'}>
                    <ImageBoxComponent
                      imagePath={actionData.avatarPath}
                      gender={actionData.gender}
                    />
                  </Box>
                )}
              </Box>
              <Box display={'flex'} justifyContent={'space-between'} gap={1}>
                <Controller
                  control={control}
                  name={'saintName'}
                  render={({ field }) => (
                    <TextField
                      sx={{ maxWidth: '70%' }}
                      id="outlined-SaintName"
                      label="Tên thánh"
                      helperText="Ex: Maria, Giuse, Anna"
                      margin="normal"
                      fullWidth={true}
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={'gender'}
                  render={({ field }) => (
                    <FormControl component="fieldset" variant="standard" sx={{ width: '25%' }}>
                      <FormLabel component="legend">Giới tính</FormLabel>
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} name="gender" />}
                        label={field.value ? 'Nữ' : 'Nam'}
                      />
                    </FormControl>
                  )}
                />
              </Box>
              <Controller
                control={control}
                name={'fullName'}
                render={({ field }) => (
                  <TextField
                    id="outlined-FullName"
                    label="Họ và Tên"
                    helperText="Ex: Nguyen Van A"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Box display={'flex'} justifyContent={'space-between'}>
                <Controller
                  control={control}
                  name={'birthday'}
                  render={({ field }) => (
                    <TextField
                      id="outlined-Birthday"
                      label="Ngày Sinh"
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
                      value={formatPhoneWithoutDot(field.value)}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Controller
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
                      value={formatPhoneWithoutDot(field.value)}
                    />
                  )}
                />
              </Box>
            </form>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        {formState.isSubmitting && (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <LinearProgressComponent progress={uploadImageProgress} />
          </Box>
        )}
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

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
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { StudentActionType } from 'constant'
import { Class, Student } from 'models'
import { splitFullName } from 'utils'
import { formatDate, formatPhoneWithoutDot, formatPhone } from 'utils/formatDataForTable'
import {
  removeImage,
  uploadAvatar,
  useAddNewStudent,
  useDeleteStudent,
  useUpdateStudent,
} from 'services'
import { ImageBoxComponent, LinearProgressComponent } from 'modules'
import { useIsMobile } from 'utils/common'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { getValues, StudentForm } from './helpers'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'

interface StudentDialogComponentProps {
  isOpen: boolean
  onClose: () => void
  action: string
  student?: Student
}

interface RemoveStudentDialogProps {
  handleSubmit: () => void
  onClose: () => void
  fullName?: string
}

const RemoveStudentDialog = ({ handleSubmit, onClose, fullName }: RemoveStudentDialogProps) => {
  return (
    <React.Fragment>
      <DialogTitle>Xoá thông tin thiếu nhi</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          {`Bạn có chắc chắn muốn xoá thông tin thiếu nhi ${fullName}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        <Button
          autoFocus={true}
          onClick={onClose}
          variant="outlined"
          color={'neutral'}
          startIcon={<ClearIcon />}
        >
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit}
          autoFocus={true}
          variant="contained"
          color={'error'}
          startIcon={<CheckIcon />}
        >
          Xoá
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}

const StudentDialogComponent = ({
  isOpen,
  onClose,
  action,
  student,
}: StudentDialogComponentProps) => {
  const fullScreen = useIsMobile()
  const { showSnackbar } = useSnackbarContext()

  const addNewStudent = useAddNewStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const { handleSubmit, control, setValue, reset, formState } = useForm<StudentForm>({
    defaultValues: getValues(student),
  })
  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0)
  useEffect(() => {
    if (action === StudentActionType.EDIT_STUDENT) {
      const stu: StudentForm = getValues(student)
      Object.keys(stu).forEach((key: string) => {
        setValue(key as keyof StudentForm, stu[key as keyof StudentForm])
      })
    }
    return () => reset()
  }, [action, student, reset, setValue])

  const onSubmit = async (data: StudentForm) => {
    const { firstName, lastName } = splitFullName(data.fullName)

    if (action === StudentActionType.DELETE_STUDENT && student?.id) {
      return deleteStudent({
        id: student.id,
        onSuccess: () =>
          showSnackbar(`Xoá Thiếu Nhi ${lastName} ${firstName} Thành Công`, 'success'),
        onError: () => showSnackbar(`Xoá Thiếu Nhi ${lastName} ${firstName} Thất Bại`, 'error'),
        onComplete: onClose,
      })
    }

    let downloadPath: string = ''
    if (data.avatar) {
      downloadPath = await uploadAvatar(data.avatar, setUploadImageProgress)
      delete data.avatar
    }
    if (action === StudentActionType.EDIT_STUDENT && student?.id) {
      const updatedStudent: Student = {
        ...data,
        id: student.id,
        firstName,
        lastName,
        birthday: formatDate(data.birthday, true),
        phones: [
          { ...data.phone1, number: formatPhone(data.phone1.number) },
          { ...data.phone2, number: formatPhone(data.phone2.number) },
        ],
        avatarPath: downloadPath || data.avatarPath || '',
      }
      return updateStudent({
        dataInput: updatedStudent,
        onSuccess: () =>
          showSnackbar(`Cập Nhật Thiếu Nhi ${lastName} ${firstName} Thành Công`, 'success'),
        onError: () =>
          showSnackbar(`Cập Nhật Thiếu Nhi ${lastName} ${firstName} Thất Bại`, 'error'),
        onComplete: () => {
          setUploadImageProgress(0)
          if (downloadPath && data.avatarPath) {
            removeImage(data.avatarPath)
          }
          onClose()
        },
      })
    }
    const newStudent: Omit<Student, 'id'> = {
      ...data,
      firstName,
      lastName,
      birthday: formatDate(data.birthday, true),
      phones: [
        { ...data.phone1, number: formatPhone(data.phone1.number) },
        { ...data.phone2, number: formatPhone(data.phone2.number) },
      ],
      avatarPath: downloadPath || '',
    }
    return addNewStudent({
      dataInput: newStudent,
      onSuccess: () =>
        showSnackbar(`Thêm Thiếu Nhi ${lastName} ${firstName} Thành Công`, 'success'),
      onError: () => showSnackbar(`Thêm Thiếu Nhi ${lastName} ${firstName} Thất Bại`, 'error'),
      onComplete: () => {
        setUploadImageProgress(0)
        onClose()
      },
    })
  }

  const handleChangeClass = (event: SelectChangeEvent) => {
    const selectedClass = BaseClasses.find((c: Class) => c.id === (event.target.value as string))
    if (typeof selectedClass === 'undefined') {
      console.error('Error at Selected class')
      return
    }
    setValue('class', selectedClass || BaseClasses[0])
  }

  return (
    <Dialog fullScreen={fullScreen} open={isOpen} onClose={onClose}>
      {action === StudentActionType.DELETE_STUDENT && (
        <RemoveStudentDialog
          onClose={onClose}
          handleSubmit={handleSubmit(onSubmit)}
          fullName={student?.fullName}
        />
      )}
      {action !== StudentActionType.DELETE_STUDENT && (
        <>
          <DialogTitle>
            {action === StudentActionType.ADD_NEW_STUDENT
              ? 'Thêm thông tin thiếu nhi'
              : 'Cập nhật thông tin thiếu nhi'}
          </DialogTitle>
          <DialogContent dividers={true}>
            <form>
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
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.files?.[0]) {
                      setValue('avatar', event.target.files[0])
                    }
                  }}
                />

                {student?.avatarPath && (
                  <Box textAlign={'center'}>
                    <ImageBoxComponent imagePath={student.avatarPath} gender={student.gender} />
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
                name={'class'}
                render={({ field }) => (
                  <ClassDropdownComponent
                    classObj={field.value}
                    onChangeClass={handleChangeClass}
                  />
                )}
              />
              <Controller
                control={control}
                name={'address'}
                render={({ field }) => (
                  <TextField
                    id="outlined-Address"
                    label="Dia Chi"
                    helperText="Ex: 231/83/13T Duong Ba Trac, p1, q8"
                    margin="normal"
                    multiline={true}
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
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
            {formState.isSubmitting && (
              <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
                <LinearProgressComponent progress={uploadImageProgress} />
              </Box>
            )}
            <Button
              autoFocus={true}
              onClick={onClose}
              variant="outlined"
              color={'neutral'}
              startIcon={<ClearIcon />}
            >
              Huỷ
            </Button>
            <Button
              type={'button'}
              onClick={handleSubmit(onSubmit)}
              autoFocus={true}
              variant="contained"
              color={action === StudentActionType.EDIT_STUDENT ? 'warning' : 'primary'}
              startIcon={<CheckIcon />}
            >
              Lưu
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default StudentDialogComponent

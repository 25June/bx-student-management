import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { formatPhone, formatPhoneWithoutDot, splitFullName } from 'utils/formatDataForTable'
import React, { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { getValues, StudentForm } from 'modules/student-dialog/helpers'
import { Student } from 'models'
import { removeImage, uploadFile, useUpdateStudent } from 'services'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import { ImageBoxComponent, LinearProgressComponent } from 'modules/index'

interface EditInfoPanelProps {
  student: Student
  setEditMode: (data: any) => void
}

const EditInfoPanelComponent = ({ student, setEditMode }: EditInfoPanelProps) => {
  const updateStudent = useUpdateStudent()
  const { handleSubmit, control, setValue, watch } = useForm<StudentForm>({
    defaultValues: getValues(student),
  })
  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0)

  const handleChangeGender = (event: React.MouseEvent<HTMLElement>, newAlignment: boolean) => {
    setValue('gender', newAlignment)
  }
  const { showSnackbar } = useSnackbarContext()
  const [isLoading, setLoading] = useState<boolean>(false)

  const onSubmit = async (data: StudentForm) => {
    setLoading(true)
    const { firstName, lastName } = splitFullName(data.fullName)
    Object.keys(data).forEach((key: any) => {
      if (data[key as keyof StudentForm] === undefined) {
        delete data[key as keyof StudentForm]
      }
    })

    let downloadPath: string = ''
    if (data.avatar) {
      downloadPath = await uploadFile(data.avatar, setUploadImageProgress)
      delete data.avatar
    }

    const updatedStudent: Student = {
      ...data,
      id: student.id,
      firstName,
      lastName,
      birthday: data.birthday,
      phones: [
        { ...data.phone1, number: formatPhone(data.phone1.number) },
        { ...data.phone2, number: formatPhone(data.phone2.number) },
        { ...data.phone3, number: formatPhone(data.phone3.number) },
      ],
      avatarPath: downloadPath || data.avatarPath || '',
    }
    return updateStudent({
      dataInput: updatedStudent,
      onSuccess: () =>
        showSnackbar(`Cập Nhật Thiếu Nhi ${lastName} ${firstName} Thành Công`, 'success'),
      onError: () => showSnackbar(`Cập Nhật Thiếu Nhi ${lastName} ${firstName} Thất Bại`, 'error'),
      onComplete: () => {
        setUploadImageProgress(0)
        if (downloadPath && data.avatarPath) {
          removeImage(data.avatarPath)
        }
        setLoading(false)
        setTimeout(() => setEditMode(false), 100)
      },
    })
  }

  return (
    <form>
      <Box mb={2}>
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
        {uploadImageProgress !== 0 && (
          <Box sx={{ width: '100%' }}>
            <LinearProgressComponent progress={uploadImageProgress} />
          </Box>
        )}

        {student?.avatarPath && (
          <Box textAlign={'center'}>
            <ImageBoxComponent imagePath={student.avatarPath} gender={student.gender} />
          </Box>
        )}
      </Box>
      <Box mb={2}>
        <Controller
          control={control}
          name={'saintName'}
          render={({ field }) => (
            <TextField
              id="outlined-SaintName"
              label="Tên thánh"
              fullWidth={true}
              variant={'standard'}
              {...field}
            />
          )}
        />
      </Box>

      <Box mb={2}>
        <Controller
          control={control}
          name={'fullName'}
          render={({ field }) => (
            <TextField
              id="outlined-FullName"
              label="Họ và Tên"
              fullWidth={true}
              variant={'standard'}
              {...field}
            />
          )}
        />
      </Box>

      <Box mb={2}>
        <Controller
          control={control}
          name={'birthday'}
          render={({ field }) => (
            <TextField
              id="outlined-Birthday"
              label="Ngày Sinh"
              type="date"
              variant={'standard'}
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              {...field}
            />
          )}
        />
      </Box>

      <Box mb={2}>
        <Controller
          control={control}
          name={'address'}
          render={({ field }) => (
            <TextField
              id="outlined-Address"
              label="Địa Chỉ"
              variant={'standard'}
              multiline={true}
              fullWidth={true}
              {...field}
            />
          )}
        />
      </Box>
      <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Controller
          control={control}
          name={'grade'}
          render={({ field }) => (
            <TextField
              sx={{ maxWidth: 100 }}
              id="outlined-Grade"
              label="Văn Hoá"
              type="string"
              variant={'standard'}
              InputLabelProps={{ shrink: true }}
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'gender'}
          render={() => (
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend" sx={{ fontSize: '0.825rem' }}>
                Giới tính
              </FormLabel>
              <ToggleButtonGroup
                size={'small'}
                color="primary"
                value={watch('gender')}
                onChange={handleChangeGender}
                aria-label="gender"
                exclusive={true}
              >
                <ToggleButton size={'small'} value={false}>
                  <MaleIcon />
                </ToggleButton>
                <ToggleButton size={'small'} value={true}>
                  <FemaleIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          )}
        />
      </Box>
      <Box
        mb={2}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Controller
          control={control}
          name={'phone1.name'}
          render={({ field }) => (
            <TextField
              id={`outlined-name-phone1`}
              label="Tên"
              type="text"
              fullWidth={true}
              variant={'standard'}
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
              id={`outlined-number-phone1`}
              label="Số Điện Thoại"
              type="number"
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
              variant={'standard'}
              {...field}
              value={formatPhoneWithoutDot(field.value)}
            />
          )}
        />
      </Box>
      <Box
        mb={2}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Controller
          control={control}
          name={'phone2.name'}
          render={({ field }) => (
            <TextField
              id={`outlined-name-phone2`}
              label="Tên"
              type="text"
              fullWidth={true}
              variant={'standard'}
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
              id={`outlined-number-phone2`}
              label="Số Điện Thoại"
              type="number"
              fullWidth={true}
              variant={'standard'}
              InputLabelProps={{ shrink: true }}
              {...field}
              value={formatPhoneWithoutDot(field.value)}
            />
          )}
        />
      </Box>
      <Box
        mb={2}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Controller
          control={control}
          name={'phone3.name'}
          render={({ field }) => (
            <TextField
              id={`outlined-name-phone1`}
              label="Tên"
              type="text"
              fullWidth={true}
              variant={'standard'}
              InputLabelProps={{ shrink: true }}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'phone3.number'}
          render={({ field }) => (
            <TextField
              id={`outlined-number-phone1`}
              label="Số Điện Thoại"
              type="number"
              fullWidth={true}
              InputLabelProps={{ shrink: true }}
              variant={'standard'}
              {...field}
              value={formatPhoneWithoutDot(field.value)}
            />
          )}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={isLoading ? <CircularProgress size={'1rem'} /> : <CheckIcon />}
          size="small"
          onClick={handleSubmit(onSubmit)}
          color="warning"
          variant="contained"
          type={'button'}
        >
          Lưu
        </Button>
        <Button
          startIcon={<ClearIcon />}
          size="small"
          onClick={() => setEditMode(false)}
          color="inherit"
          variant="outlined"
          disabled={student.isDeleted}
          type={'button'}
        >
          Huỷ
        </Button>
      </Box>
    </form>
  )
}

export default EditInfoPanelComponent

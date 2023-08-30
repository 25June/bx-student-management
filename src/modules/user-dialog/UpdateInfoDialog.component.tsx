import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material'
import { BaseClasses, BaseClassObj, Role } from 'constant/common'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { User } from 'models/user'
import { useForm, Controller } from 'react-hook-form'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import { Class } from 'models'
import { useUpdateUserInfo } from 'services/user'
import { ImageBoxComponent, LinearProgressComponent } from 'modules/index'
import { uploadFile } from 'services'
import { useIsMobile } from 'utils/common'

interface UserInfoProps {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  classId: string
  avatarPath: string
  avatar?: File | null
  saintName: string
}

const defaultUserInfo = (user: User) => {
  return {
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    classId: user.classId || '',
    avatarPath: user.avatarPath || '',
    saintName: user.saintName || '',
  }
}

interface UpdateInfoDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
  user: User
}

const UpdateInfoDialogComponent = ({ onClose, isOpen, user }: UpdateInfoDialogComponentProps) => {
  const { handleSubmit, setValue, control, formState } = useForm<UserInfoProps>({
    defaultValues: defaultUserInfo(user),
  })
  const isMobile = useIsMobile()
  const updateUserInfo = useUpdateUserInfo()
  const [classObj, setClassObj] = useState<{ id: string; name: string }>()
  const [uploadImageProgress, setUploadImageProgress] = useState<number>(0)

  useEffect(() => {
    if (user.classId) {
      setClassObj({
        id: user.classId,
        name: BaseClassObj[user.classId],
      })
    }
  }, [user])

  const handleChangeClass = (event: SelectChangeEvent) => {
    const selectedClass = BaseClasses.find((c: Class) => c.id === (event.target.value as string))
    if (typeof selectedClass === 'undefined') {
      console.error('Error at Selected class')
      return
    }
    setValue('classId', selectedClass.id || BaseClasses[0].id)
    setClassObj(selectedClass)
  }

  const onSubmit = async (data: UserInfoProps) => {
    let downloadPath: string = ''
    if (data.avatar) {
      downloadPath = await uploadFile(data.avatar, setUploadImageProgress)
      delete data.avatar
    }
    updateUserInfo({
      ...data,
      avatarPath: downloadPath ? downloadPath : user.avatarPath || '',
      id: user.id,
    } as User).finally(() => onClose(true))
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      aria-labelledby="user-dialog-title"
      maxWidth={'sm'}
      fullWidth={isMobile}
      fullScreen={isMobile}
    >
      <DialogTitle id="change-password-dialog-title">Cập Nhật Thông Tin</DialogTitle>
      <DialogContent dividers={true}>
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

          {user.avatarPath && (
            <Box textAlign={'center'}>
              <ImageBoxComponent imagePath={user.avatarPath} maxWidth={200} />
            </Box>
          )}
        </Box>
        <Controller
          control={control}
          name={'email'}
          render={({ field, fieldState }) => {
            return (
              <TextField
                label={'Email'}
                variant={'outlined'}
                helperText={fieldState?.error?.message}
                margin={'normal'}
                type={'email'}
                fullWidth={true}
                disabled={user.role !== Role.CTO}
                error={!!fieldState.error}
                {...field}
              />
            )
          }}
        />
        <Controller
          control={control}
          name={'saintName'}
          render={({ field, fieldState }) => {
            return (
              <TextField
                label={'Tên Thánh'}
                variant={'outlined'}
                helperText={fieldState?.error?.message}
                margin={'normal'}
                type={'text'}
                fullWidth={true}
                error={!!fieldState.error}
                {...field}
              />
            )
          }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Controller
            control={control}
            name={'lastName'}
            render={({ field, fieldState }) => {
              return (
                <TextField
                  label={'Họ'}
                  variant={'outlined'}
                  helperText={fieldState?.error?.message}
                  margin={'normal'}
                  type={'email'}
                  fullWidth={true}
                  error={!!fieldState.error}
                  {...field}
                />
              )
            }}
          />
          <Controller
            control={control}
            name={'firstName'}
            render={({ field, fieldState }) => {
              return (
                <TextField
                  label={'Tên'}
                  variant={'outlined'}
                  helperText={fieldState?.error?.message}
                  margin={'normal'}
                  type={'text'}
                  fullWidth={true}
                  error={!!fieldState.error}
                  {...field}
                />
              )
            }}
          />
        </Box>
        <Controller
          control={control}
          name={'phoneNumber'}
          render={({ field, fieldState }) => {
            return (
              <TextField
                label={'Điện Thoại'}
                variant={'outlined'}
                helperText={fieldState?.error?.message}
                margin={'normal'}
                type={'text'}
                fullWidth={true}
                error={!!fieldState.error}
                inputMode={'decimal'}
                {...field}
              />
            )
          }}
        />
        <Box sx={{ marginTop: '1rem' }}>
          <ClassDropdownComponent onChangeClass={handleChangeClass} classObj={classObj} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        {formState.isSubmitting && (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
            <LinearProgressComponent progress={uploadImageProgress} />
          </Box>
        )}
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
          color={'primary'}
          startIcon={<CheckIcon />}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateInfoDialogComponent

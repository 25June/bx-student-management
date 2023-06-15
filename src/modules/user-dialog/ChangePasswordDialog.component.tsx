import React from 'react'
import { useSignOut, useUpdatePassword } from 'services/user'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { Controller, useForm } from 'react-hook-form'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'

interface ChangePasswordDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
}

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ChangePasswordDialogComponent = ({ onClose, isOpen }: ChangePasswordDialogComponentProps) => {
  const updatePassword = useUpdatePassword()
  const signOut = useSignOut()
  const { showSnackbar } = useSnackbarContext()

  const { handleSubmit, control } = useForm<ChangePasswordForm>({
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })

  const onSubmit = ({ newPassword, confirmNewPassword }: ChangePasswordForm) => {
    if (confirmNewPassword !== newPassword) {
      showSnackbar('Password is not match', 'error')
      return
    }
    updatePassword(newPassword).finally(() => {
      onClose(true)
      signOut()
    })
  }
  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="user-dialog-title">
      <DialogTitle id="change-password-dialog-title">Thay Đổi Mật Khẩu</DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'currentPassword'}
          render={({ field }) => (
            <TextField
              required={true}
              id="outlined-password"
              label="Current Password"
              type="password"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'newPassword'}
          render={({ field }) => (
            <TextField
              required={true}
              id="outlined-password"
              label="New Password"
              type="password"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'confirmNewPassword'}
          render={({ field }) => (
            <TextField
              required={true}
              id="outlined-confirmPassword"
              label="Confirm New Password"
              type="password"
              margin="normal"
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
          color={'primary'}
          startIcon={<CheckIcon />}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialogComponent

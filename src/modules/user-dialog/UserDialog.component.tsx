import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useCreateUser } from 'services/user'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbarContext } from 'contexts/SnackbarContext'

interface UserDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
}

interface UserFormProps {
  email: string
  password: string
  confirmPassword: string
}

const UserDialogComponent = ({ onClose, isOpen }: UserDialogComponentProps) => {
  const createUser = useCreateUser()
  const { showSnackbar } = useSnackbarContext()

  const { handleSubmit, control } = useForm<UserFormProps>({
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = ({ email, password, confirmPassword }: UserFormProps) => {
    if (confirmPassword !== password) {
      showSnackbar('Password is not match', 'error')
      return
    }
    createUser(email, password).finally(() => {
      showSnackbar('Create process completed', 'success')
      onClose(true)
    })
  }
  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="user-dialog-title">
      <DialogTitle id="diligent-dialog-title">Thêm GLV</DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'email'}
          render={({ field }) => (
            <TextField
              id="outlined-email"
              label="Email"
              type="text"
              helperText="ngocphu2506@gmail.com"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'password'}
          render={({ field }) => (
            <TextField
              id="outlined-password"
              label="Password"
              type="password"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'confirmPassword'}
          render={({ field }) => (
            <TextField
              id="outlined-confirmPassword"
              label="Confirm Password"
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

export default UserDialogComponent

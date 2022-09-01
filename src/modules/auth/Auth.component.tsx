import { UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'
import React, { useState } from 'react'
import {
  Box,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  AlertProps,
  Typography,
  Button,
} from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useForm, Controller } from 'react-hook-form'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'

type SignInForm = {
  email: string
  password: string
  confirmPassword: string
}

const AuthComponent = () => {
  const { control, handleSubmit } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackBarContent, setSnackbarContent] = useState<{
    severity: AlertProps['severity']
    message: string
  }>({
    severity: 'success',
    message: '',
  })

  const onSubmit = (values: SignInForm) => {
    if (values.password !== values.confirmPassword) {
      setSnackbarContent({ severity: 'error', message: `Mật khẩu không trùng khớp` })
      setOpenSnackbar(true)
    }
    console.log(values)
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(({ user }: UserCredential) => {
        console.log(user)
        setSnackbarContent({ severity: 'success', message: `${user.email} Đăng nhập thành công` })
        setOpenSnackbar(true)
      })
      .catch((error) => {
        console.error(error)
        setSnackbarContent({ severity: 'error', message: `Đăng nhập thất bại` })
        setOpenSnackbar(true)
      })
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showPassword)
  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      textAlign={'left'}
    >
      <Box width={500} border={'1px solid #F0F0F0'} padding={2}>
        <Typography variant={'h3'}>Đăng ký</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            rules={{ required: true }}
            control={control}
            name={'email'}
            render={({ field }) => {
              return (
                <TextField
                  label={'Nhập email'}
                  variant={'outlined'}
                  helperText={'abc@gmail.com'}
                  margin={'normal'}
                  type={'email'}
                  fullWidth={true}
                  {...field}
                />
              )
            }}
          />
          <Controller
            rules={{ required: true }}
            control={control}
            name={'password'}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor={'outlined-adornment-password'}>Mật khẩu</InputLabel>
                  <OutlinedInput
                    id={'outlined-adornment-password'}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth={true}
                    {...field}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </>
              )
            }}
          />
          <Controller
            rules={{ required: true }}
            control={control}
            name={'confirmPassword'}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor={'outlined-adornment-confirm-password'}>
                    Xác nhận lại mật khẩu
                  </InputLabel>
                  <OutlinedInput
                    id={'outlined-adornment-confirm-password'}
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth={true}
                    {...field}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </>
              )
            }}
          />
          <Button type={'submit'} onSubmit={handleSubmit(onSubmit)}>
            Đăng nhập
          </Button>
        </form>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackBarContent.severity}
          sx={{ width: '100%' }}
        >
          {snackBarContent.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AuthComponent

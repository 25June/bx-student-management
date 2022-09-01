import { Controller, useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  AlertProps,
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'

type SignUpForm = {
  email: string
  password: string
}

const SignInComponent = () => {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<SignUpForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackBarContent, setSnackbarContent] = useState<{
    severity: AlertProps['severity']
    message: string
  }>({
    severity: 'success',
    message: '',
  })

  const onSubmit = (values: SignUpForm) => {
    console.log(values)
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(({ user }: UserCredential) => {
        console.log(user)
        setSnackbarContent({ severity: 'success', message: `${user.email} Đăng nhập thành công` })
        setOpenSnackbar(true)
        navigate('/')
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

  return (
    <Box>
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

export default SignInComponent

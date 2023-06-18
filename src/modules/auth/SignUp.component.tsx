import { Controller, useForm } from 'react-hook-form'
import React, { useState, useEffect } from 'react'
import {
  Alert,
  AlertProps,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  Link,
} from '@mui/material'
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { Router } from '../../routes'
import { Link as RouterLink } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type SignUpForm = {
  email: string
  password: string
  confirmPassword: string
}

const SignUpValidationSchema = yup.object().shape({
  email: yup.string().email('Please enter correct email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().required('Confirm Password is required'),
})

const SignUpComponent = () => {
  const { control, handleSubmit, watch, getValues } = useForm<SignUpForm>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(SignUpValidationSchema),
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true)
  const [snackBarContent, setSnackbarContent] = useState<{
    severity: AlertProps['severity']
    message: string
  }>({
    severity: 'success',
    message: '',
  })
  const watchConfirmPassword = watch('confirmPassword')

  useEffect(() => {
    if (getValues('password') !== getValues('confirmPassword')) {
      setPasswordMatch(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchConfirmPassword])

  const onSubmit = (values: SignUpForm) => {
    if (values.password !== values.confirmPassword) {
      setSnackbarContent({ severity: 'error', message: `Mật khẩu không trùng khớp` })
      setOpenSnackbar(true)
    }
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(({ user }: UserCredential) => {
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
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Box sx={{ width: 500, border: '1px solid #F0F0F0', padding: 2, borderRadius: 5 }}>
        <Typography variant={'h3'}>Sign up</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            rules={{ required: true }}
            control={control}
            name={'email'}
            render={({ field, fieldState }) => {
              return (
                <TextField
                  label={'Email'}
                  variant={'outlined'}
                  helperText={fieldState.error ? fieldState.error.message || '' : 'abc@gmail.com'}
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
            rules={{ required: true }}
            control={control}
            name={'password'}
            render={({ field, fieldState }) => {
              return (
                <FormControl variant={'outlined'} fullWidth={true} margin={'dense'}>
                  <InputLabel error={!!fieldState.error} htmlFor={'outlined-adornment-password'}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id={'outlined-adornment-password'}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth={true}
                    label={'Password'}
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
                  <FormHelperText variant={'outlined'} error={!!fieldState.error}>
                    {fieldState.error ? fieldState.error.message : ''}
                  </FormHelperText>
                </FormControl>
              )
            }}
          />
          <Controller
            rules={{ required: true }}
            control={control}
            name={'confirmPassword'}
            render={({ field, fieldState }) => {
              return (
                <FormControl variant={'outlined'} fullWidth={true} margin={'dense'}>
                  <InputLabel
                    error={!!fieldState.error}
                    htmlFor={'outlined-adornment-confirm-password'}
                  >
                    Confirm password
                  </InputLabel>
                  <OutlinedInput
                    id={'outlined-adornment-confirm-password'}
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth={true}
                    label={'Confirm password'}
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
                  <FormHelperText variant={'outlined'} error={!!fieldState.error}>
                    {!passwordMatch
                      ? `Password don't match`
                      : fieldState.error
                      ? fieldState.error.message
                      : ''}
                  </FormHelperText>
                </FormControl>
              )
            }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 3,
            }}
          >
            <Button type={'submit'} variant={'contained'} onSubmit={handleSubmit(onSubmit)}>
              Sign up
            </Button>
            <Link component={RouterLink} to={Router.SIGN_IN}>
              Sign in
            </Link>
          </Box>
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

export default SignUpComponent

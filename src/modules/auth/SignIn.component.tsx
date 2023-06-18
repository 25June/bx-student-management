import { Controller, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
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
  FormControl,
  Link,
  FormHelperText,
} from '@mui/material'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '../../firebase'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import { Router } from '../../routes'
import { Link as RouterLink } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type SignInForm = {
  email: string
  password: string
}

const SignInValidationSchema = yup.object().shape({
  email: yup.string().email('Please enter correct email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const SignInComponent = () => {
  const navigate = useNavigate()
  const { control, handleSubmit, reset } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(SignInValidationSchema),
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

  useEffect(() => {
    return () => reset()
  }, [reset])

  const onSubmit = (values: SignInForm) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(({ user }: UserCredential) => {
        setSnackbarContent({ severity: 'success', message: `${user.email} Đăng nhập thành công` })
        setOpenSnackbar(true)
        navigate(Router.HOME)
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
        <Typography variant={'h3'}>Sign in</Typography>
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
                <FormControl variant={'outlined'} fullWidth={true}>
                  <InputLabel error={!!fieldState.error} htmlFor={'outlined-adornment-password'}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id={'outlined-adornment-password'}
                    type={showPassword ? 'text' : 'password'}
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 3,
            }}
          >
            <Button type={'submit'} variant={'contained'} onSubmit={handleSubmit(onSubmit)}>
              Sign in
            </Button>
            <Link component={RouterLink} to={Router.SIGN_UP}>
              Sign up
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

export default SignInComponent

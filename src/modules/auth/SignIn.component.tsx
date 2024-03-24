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
import { Router } from 'routes'
import { Link as RouterLink } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Background from 'static/images/cards/login-background.webp'
import { useIsMobile } from 'utils/common'
import { grey } from '@mui/material/colors'
import SendIcon from '@mui/icons-material/Send'
import CircularProgress from '@mui/material/CircularProgress'

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
  const isMobile = useIsMobile()
  const { control, handleSubmit, reset } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(SignInValidationSchema),
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
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
    setLoading(true)
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(({ user }: UserCredential) => {
        setSnackbarContent({ severity: 'success', message: `${user.email} Đăng nhập thành công` })
        setOpenSnackbar(true)
        setLoading(false)
        setTimeout(() => navigate(Router.DASHBOARD), 100)
      })
      .catch((error) => {
        console.error(error)
        setSnackbarContent({ severity: 'error', message: `Đăng nhập thất bại` })
        setLoading(false)
        setOpenSnackbar(true)
      })
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <>
      <Box
        component={'img'}
        src={Background}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          objectFit: 'cover',
          width: '100vw',
          height: '100vh',
          objectPosition: 'center',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          padding: isMobile ? 2 : 3,
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 500,
            border: '1px solid #F0F0F0',
            padding: 2,
            borderRadius: 5,
            boxShadow: 2,
            background: 'rgba(255,255,255, 0.6)',
          }}
        >
          <Typography
            variant={'h5'}
            sx={{ color: grey[900], textAlign: 'left', marginBottom: '0.5rem' }}
          >
            Chào Mừng Giáo Lý Viên!
          </Typography>
          <Typography sx={{ color: grey[900], textAlign: 'left' }} fontSize={'0.825rem'}>
            Cảm ơn bạn vì nỗ lực rất nhiều cho các em thiếu nhi. Website này giúp bạn lưu thông tin
            các em tiện lợi hơn.
          </Typography>
          <Typography sx={{ color: grey[900], textAlign: 'left' }} fontSize={'0.825rem'}>
            Nào! Hãy bắt đầu thôi...
          </Typography>
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
                    helperText={fieldState?.error?.message || ''}
                    margin={'normal'}
                    type={'email'}
                    autoComplete={'email'}
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
                      Mật khẩu
                    </InputLabel>
                    <OutlinedInput
                      id={'outlined-adornment-password'}
                      type={showPassword ? 'text' : 'password'}
                      label={'Mật khẩu'}
                      autoComplete={'password'}
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
              <Button
                endIcon={isLoading ? <CircularProgress size={'1rem'} /> : <SendIcon />}
                type={'submit'}
                variant={'contained'}
                onSubmit={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                Let's go
              </Button>
              <Link component={RouterLink} to={Router.SIGN_UP} sx={{ display: 'none' }}>
                Sign up
              </Link>
            </Box>
          </form>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackBarContent.severity}
            sx={{ width: '100%' }}
          >
            {snackBarContent.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  )
}

export default SignInComponent

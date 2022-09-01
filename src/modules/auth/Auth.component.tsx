import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import SignInComponent from './SignIn.component'
import SignUpComponent from './SignUp.component'

enum AuthenticationMethod {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

const AuthComponent = () => {
  const [currentMethod, setCurrentMethod] = useState<AuthenticationMethod>(
    AuthenticationMethod.SIGN_IN
  )

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      textAlign={'left'}
    >
      {currentMethod === AuthenticationMethod.SIGN_IN && (
        <>
          <SignInComponent />
          <Button onClick={() => setCurrentMethod(AuthenticationMethod.SIGN_UP)}>Đăng ký</Button>
        </>
      )}
      {currentMethod === AuthenticationMethod.SIGN_UP && (
        <>
          <SignUpComponent />
          <Button onClick={() => setCurrentMethod(AuthenticationMethod.SIGN_IN)}>Đăng nhập</Button>
        </>
      )}
    </Box>
  )
}

export default AuthComponent

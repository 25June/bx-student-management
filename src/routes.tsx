import React from 'react'
import LayoutComponent from './modules/layout/Layout.component'
import SignUpComponent from './modules/auth/SignUp.component'
import SignInComponent from './modules/auth/SignIn.component'

export const Router = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  HOME: '/',
}

const ROUTES = [
  {
    name: 'Homepage',
    component: <LayoutComponent />,
    path: '/',
  },
  {
    name: 'SignIn',
    component: <SignInComponent />,
    path: '/sign-in',
  },
  {
    name: 'SignUp',
    component: <SignUpComponent />,
    path: '/sign-up',
  },
]

export default ROUTES

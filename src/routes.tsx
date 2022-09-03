import React from 'react'
import HomeComponent from './pages/homepage/Home.component'
import { SignUpComponent, SignInComponent } from './modules/index'

export const Router = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  HOME: '/',
}

const ROUTES = [
  {
    name: 'Homepage',
    component: <HomeComponent />,
    path: Router.HOME,
    isPrivate: true,
  },
  {
    name: 'SignIn',
    component: <SignInComponent />,
    path: Router.SIGN_IN,
    isPrivate: false,
  },
  {
    name: 'SignUp',
    component: <SignUpComponent />,
    path: Router.SIGN_UP,
    isPrivate: false,
  },
]

export default ROUTES

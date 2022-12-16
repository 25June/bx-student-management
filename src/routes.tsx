import React, { lazy } from 'react'

const HomeComponent = lazy(() => import('pages/homepage/Home.component'))
const ImportComponent = lazy(() => import('pages/import/Import.component'))
const SignUpComponent = lazy(() => import('modules/auth/SignUp.component'))
const SignInComponent = lazy(() => import('modules/auth/SignIn.component'))
export const Router = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  IMPORT: '/import',
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
    name: 'Import',
    component: <ImportComponent />,
    path: Router.IMPORT,
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

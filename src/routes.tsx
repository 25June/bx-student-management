import React from 'react'
import LayoutComponent from './modules/layout/Layout.component'
import AuthComponent from './modules/auth/Auth.component'

const ROUTES = [
  {
    name: 'Homepage',
    component: <LayoutComponent />,
    path: '/',
  },
  {
    name: 'SignIn',
    component: <AuthComponent />,
    path: '/signIn',
  },
]

export default ROUTES

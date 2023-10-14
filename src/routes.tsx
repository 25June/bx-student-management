import React, { lazy } from 'react'

const HomeComponent = lazy(() => import('pages/homepage/Home.component'))
// const SignUpComponent = lazy(() => import('modules/auth/SignUp.component'))
const SignInComponent = lazy(() => import('modules/auth/SignIn.component'))
const ScoreBookComponent = lazy(() => import('pages/score-book/ScoreBook.component'))
const AssessmentComponent = lazy(() => import('pages/assessment/Assessment.component'))
const DiligentComponent = lazy(() => import('pages/diligent/Diligent.component'))
const UserComponent = lazy(() => import('pages/user/User.component'))
const RegisterComponent = lazy(() => import('pages/register/Register.component'))
const RegisterDashboardComponent = lazy(() => import('pages/register/RegisterDashBoard.component'))
const ReportComponent = lazy(() => import('pages/report/Report.component'))

export const Router = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  REPORT: '/report',
  SCORE_BOOK: '/score-book',
  ASSESSMENT: '/assessment',
  DILIGENT: '/diligent',
  HOME: '/',
  USER: '/user',
  REGISTER: '/register',
  REGISTER_DASHBOARD: '/register-dashboard',
}

const ROUTES = [
  {
    name: 'Homepage',
    component: <HomeComponent />,
    path: Router.HOME,
    isPrivate: true,
  },
  {
    name: 'Score Book',
    component: <ScoreBookComponent />,
    path: Router.SCORE_BOOK,
    isPrivate: true,
  },
  {
    name: 'Assessment',
    component: <AssessmentComponent />,
    path: Router.ASSESSMENT,
    isPrivate: true,
  },
  {
    name: 'Diligent',
    component: <DiligentComponent />,
    path: Router.DILIGENT,
    isPrivate: true,
  },
  {
    name: 'Report',
    component: <ReportComponent />,
    path: Router.REPORT,
    isPrivate: true,
  },
  {
    name: 'SignIn',
    component: <SignInComponent />,
    path: Router.SIGN_IN,
    isPrivate: false,
  },
  // {
  //   name: 'SignUp',
  //   component: <SignUpComponent />,
  //   path: Router.SIGN_UP,
  //   isPrivate: false,
  // },
  {
    name: 'User',
    component: <UserComponent />,
    path: Router.USER,
    isPrivate: true,
  },
  {
    name: 'Register',
    component: <RegisterComponent />,
    path: Router.REGISTER,
    isPrivate: false,
  },
  {
    name: 'Register Dashboard',
    component: <RegisterDashboardComponent />,
    path: Router.REGISTER_DASHBOARD,
    isPrivate: true,
  },
]

export default ROUTES

import React, { useEffect, useState, Suspense } from 'react'
import { AuthContextStatus, useAuthentication } from 'contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Router } from 'routes'
import LayoutComponent from 'modules/layout/Layout.component'
import FallbackComponent from 'modules/fallback/Fallback.component'

const PrivateComponent = ({ component }: { component: React.ReactElement }) => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const { status, isSignedIn, user } = useAuthentication()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (status === AuthContextStatus.FINISH) {
      if (!isSignedIn) {
        navigate(Router.SIGN_IN)
      }

      if (location.pathname === Router.USER) {
        navigate(Router.HOME)
      }
      setLoading(false)
    }
  }, [status, navigate, isSignedIn, user, location.pathname])
  if (isLoading) {
    return <FallbackComponent />
  }
  return (
    <LayoutComponent>
      <Suspense fallback={<FallbackComponent />}>{component}</Suspense>
    </LayoutComponent>
  )
}

export default PrivateComponent

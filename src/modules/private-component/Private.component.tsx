import React, { useEffect, useState, Suspense } from 'react'
import { AuthContextStatus, useAuthentication } from 'contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Router } from 'routes'
import LayoutComponent from 'modules/layout/Layout.component'
import FallbackComponent from 'modules/fallback/Fallback.component'

const PrivateComponent = ({ component }: { component: React.ReactElement }) => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const auth = useAuthentication()
  const navigate = useNavigate()
  useEffect(() => {
    if (auth.status === AuthContextStatus.FINISH) {
      if (!auth.isSignedIn) {
        navigate(Router.SIGN_IN)
      }
      setLoading(false)
    }
  }, [auth, navigate])
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

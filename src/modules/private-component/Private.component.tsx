import React, { useEffect, useState } from 'react'
import { AuthContextStatus, useAuthentication } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Router } from '../../routes'

const PrivateComponent = ({ component }: { component: React.ReactElement }) => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const auth = useAuthentication()
  const navigate = useNavigate()
  useEffect(() => {
    if (auth.status === AuthContextStatus.FINISH) {
      console.log('finish')
      console.log(auth)
      if (!auth.isSignedIn) {
        navigate(Router.SIGN_IN)
      }
      setLoading(false)
    }
  }, [auth])
  if (isLoading) {
    return null
  }
  return component
}

export default PrivateComponent

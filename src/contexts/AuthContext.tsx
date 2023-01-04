import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { getAuth, User } from 'firebase/auth'

interface AuthContextProps {
  isSignedIn: boolean
  user: User | null
  status: AuthContextStatus
}

export enum AuthContextStatus {
  START = 'START',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISH = 'FINISH',
}

const authContextDefaultValues = {
  isSignedIn: false,
  user: null,
  status: AuthContextStatus.START,
}

const AuthContext = createContext<AuthContextProps>(authContextDefaultValues)

export const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const auth = getAuth()
  const [isSignedIn, setSignedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthContextStatus>(AuthContextStatus.START)
  const value = {
    isSignedIn,
    user,
    status,
  }
  useEffect(() => {
    setStatus(AuthContextStatus.IN_PROGRESS)
    auth.onAuthStateChanged((authUser: User | null) => {
      if (authUser) {
        setSignedIn(true)
        setUser(authUser)
      } else {
        setSignedIn(false)
        setUser(null)
      }
      setStatus(AuthContextStatus.FINISH)
    })
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthentication = () => {
  return useContext(AuthContext)
}

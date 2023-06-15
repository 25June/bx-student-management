import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { getAuth, User as AuthUser } from 'firebase/auth'
import { User } from 'models/user'
import { getUserInfo } from 'services/user'

interface AuthContextProps {
  isSignedIn: boolean
  authUser: AuthUser | null
  status: AuthContextStatus
  user?: User | null
}

export enum AuthContextStatus {
  START = 'START',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISH = 'FINISH',
}

const authContextDefaultValues = {
  isSignedIn: false,
  authUser: null,
  status: AuthContextStatus.START,
  user: null,
}

const AuthContext = createContext<AuthContextProps>(authContextDefaultValues)

export const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const auth = getAuth()
  const [isSignedIn, setSignedIn] = useState<boolean>(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [user, setUser] = useState<User | null>()
  const [status, setStatus] = useState<AuthContextStatus>(AuthContextStatus.START)
  const value = {
    isSignedIn,
    authUser,
    status,
    user,
  }
  useEffect(() => {
    setStatus(AuthContextStatus.IN_PROGRESS)
    auth.onAuthStateChanged((authenticationUser: AuthUser | null) => {
      if (authenticationUser) {
        setSignedIn(true)
        setAuthUser(authenticationUser)
        getUserInfo(authenticationUser.uid).then((data) => {
          if (data) {
            setUser(data)
          }
        })
      } else {
        setSignedIn(false)
        setAuthUser(null)
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

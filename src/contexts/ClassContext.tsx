import React, { useContext, createContext, PropsWithChildren, useState, useMemo } from 'react'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'
import { useAuthentication } from 'contexts/AuthContext'

interface ClassContextProps {
  classId: string
  setClassId: (classId: string) => void
  classObj?: Class
}

const classContextDefaultProps: ClassContextProps = {
  classId: BaseClasses[0].id,
  setClassId: () => null,
  classObj: BaseClasses[0],
}

const ClassContext = createContext(classContextDefaultProps)

export const ClassProvider = ({ children }: PropsWithChildren) => {
  const { isSignedIn } = useAuthentication()
  const [classId, setClassId] = useState<string>(BaseClasses[0].id)
  const value = useMemo(() => {
    return {
      classId: isSignedIn ? classId : '',
      setClassId,
      classObj: BaseClasses.find((c) => c.id === classId),
    }
  }, [classId, isSignedIn])
  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
}

export const useClassContext = () => {
  const context = useContext(ClassContext)
  if (!context) {
    return classContextDefaultProps
  }

  return context
}

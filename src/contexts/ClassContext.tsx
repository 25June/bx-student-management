import React, { useContext, createContext, PropsWithChildren, useState, useMemo } from 'react'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'
import { useAuthentication } from 'contexts/AuthContext'

interface ClassContextProps {
  classId: string
  semesterId: string
  schoolYearId: string
  setClassId: (classId: any) => void
  classObj?: Class
  setSchoolYearId: (value: any) => void
  setSemesterId: (value: any) => void
}

const classContextDefaultProps: ClassContextProps = {
  classId: BaseClasses[0].id,
  setClassId: () => null,
  classObj: BaseClasses[0],
  schoolYearId: '',
  semesterId: '',
  setSchoolYearId: () => null,
  setSemesterId: () => null,
}

const ClassContext = createContext(classContextDefaultProps)

export const ClassProvider = ({ children }: PropsWithChildren) => {
  const { isSignedIn } = useAuthentication()
  const [classId, setClassId] = useState<string>(BaseClasses[0].id)
  const [schoolYearId, setSchoolYearId] = useState<string>('2023-2024')
  const [semesterId, setSemesterId] = useState<string>('hk1')
  const value = useMemo(() => {
    return {
      classId: isSignedIn ? classId : '',
      setClassId,
      classObj: BaseClasses.find((c) => c.id === classId),
      schoolYearId,
      semesterId,
      setSchoolYearId,
      setSemesterId,
    }
  }, [classId, isSignedIn, schoolYearId, semesterId])
  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
}

export const useClassContext = () => {
  const context = useContext(ClassContext)
  if (!context) {
    return classContextDefaultProps
  }

  return context
}

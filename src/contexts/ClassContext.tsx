import React, { useContext, createContext, PropsWithChildren, useState, useMemo } from 'react'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'

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
  const [classId, setClassId] = useState<string>(BaseClasses[0].id)
  const value = useMemo(() => {
    return {
      classId,
      setClassId,
      classObj: BaseClasses.find((c) => c.id === classId),
    }
  }, [classId])
  return <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
}

export const useClassContext = () => {
  const context = useContext(ClassContext)
  if (!context) {
    return classContextDefaultProps
  }

  return context
}

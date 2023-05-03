import { useMemo, useContext, createContext, PropsWithChildren } from 'react'
import { useGetStudents } from 'services'
import { Student } from 'models'

const studentDefaultValue = { students: [] } as { students: Student[] }

const StudentContext = createContext(studentDefaultValue)

export const StudentProvider = ({ children }: PropsWithChildren) => {
  const { students } = useGetStudents()
  const value = useMemo(() => {
    return students ? { students } : { students: [] }
  }, [students])
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export const useStudentContext = () => {
  const context = useContext(StudentContext)
  if (!context) {
    return studentDefaultValue
  }
  return context
}

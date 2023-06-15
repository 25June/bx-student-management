import { useMemo, useContext, createContext, PropsWithChildren } from 'react'
import { Student } from 'models'
import { useClassContext } from 'contexts/ClassContext'
import { useGetStudents } from 'services/student'

const studentDefaultValue = {
  students: [],
} as { students: Student[] }

const StudentContext = createContext(studentDefaultValue)

export const StudentProvider = ({ children }: PropsWithChildren) => {
  const { classId } = useClassContext()
  const { students } = useGetStudents(classId)

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

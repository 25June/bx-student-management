import { useMemo, useContext, createContext, PropsWithChildren, useCallback } from 'react'
import { Student } from 'models'
import { useClassContext } from 'contexts/ClassContext'
import { useGetStudents } from 'services/student'

const studentDefaultValue = {
  students: [],
  stopListener: () => null,
} as { students: Student[]; stopListener: () => void }

const StudentContext = createContext(studentDefaultValue)

export const StudentProvider = ({ children }: PropsWithChildren) => {
  const { classId } = useClassContext()
  const { students, listener } = useGetStudents(classId)

  const stopListener = useCallback(() => {
    if (listener) {
      console.log('stop listener of student')
      listener()
    }
  }, [listener])

  const value = useMemo(() => {
    return students ? { students, stopListener } : { students: [], stopListener }
  }, [students, stopListener])
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export const useStudentContext = () => {
  const context = useContext(StudentContext)
  if (!context) {
    return studentDefaultValue
  }
  return context
}

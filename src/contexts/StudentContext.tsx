import { useContext, createContext, PropsWithChildren, useEffect } from 'react'
import { Student } from 'models'
import { useClassContext } from 'contexts/ClassContext'
import { useGetStudents } from 'services/student'

const studentDefaultValue = {
  students: [],
  deletedStudents: [],
  fetchStudents: () => null
} as { students: Student[]; deletedStudents: Student[], fetchStudents: (classId: string) => void }

const StudentContext = createContext(studentDefaultValue)

export const StudentProvider = ({ children }: PropsWithChildren) => {
  const { classId } = useClassContext()
  const { students, deletedStudents, fetchStudents } = useGetStudents()

  useEffect(() => {
    if (classId) {
      fetchStudents(classId)
    }
    // eslint-disable-next-line
  }, [classId])

  return <StudentContext.Provider value={{ students: students || [], deletedStudents, fetchStudents }}>{children}</StudentContext.Provider>
}

export const useStudentContext = () => {
  const context = useContext(StudentContext)
  if (!context) {
    return studentDefaultValue
  }
  return context
}

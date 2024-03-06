import { useContext, createContext, PropsWithChildren, useEffect } from 'react'
import { Student } from 'models'
import { useClassContext } from 'contexts/ClassContext'
import { useGetStudents } from 'services/student'
import { toLowerCaseNonAccentVietnamese } from 'utils/common'

interface Props {
  students: Student[]
  deletedStudents: Student[]
  fetchStudents: (classId: string) => void
  studentByKeywords: Record<string, string[]>
}
const studentDefaultValue = {
  students: [],
  deletedStudents: [],
  fetchStudents: () => null,
  studentByKeywords: {},
} as Props

const StudentContext = createContext(studentDefaultValue)

export const StudentProvider = ({ children }: PropsWithChildren) => {
  const { classId } = useClassContext()
  const { students, deletedStudents, fetchStudents } = useGetStudents()
  const studentByKeywords = (students ?? []).reduce(
    (acc: Record<string, string[]>, currentStudent: Student) => {
      return {
        ...acc,
        [currentStudent.id]: [
          ...currentStudent.lastName.split(' '),
          ...currentStudent.firstName.split(' '),
          currentStudent.saintName,
        ].map((keyword) => toLowerCaseNonAccentVietnamese(keyword)),
      }
    },
    {} as Record<string, string[]>
  )
  console.log({ studentByKeywords })
  useEffect(() => {
    if (classId) {
      fetchStudents(classId)
    }
    // eslint-disable-next-line
  }, [classId])

  return (
    <StudentContext.Provider
      value={{ students: students || [], deletedStudents, fetchStudents, studentByKeywords }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export const useStudentContext = () => {
  const context = useContext(StudentContext)
  if (!context) {
    return studentDefaultValue
  }
  return context
}

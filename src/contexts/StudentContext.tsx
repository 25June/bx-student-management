import { useMemo, useContext, createContext, PropsWithChildren, useState } from 'react'
import { useGetStudents } from 'services'
import { Student } from 'models'

const studentDefaultValue = {
  students: [],
  setClassId: () => null,
  classId: 'kt1',
} as { students: Student[]; setClassId: (classId: string) => void; classId?: string }

const StudentContext = createContext(studentDefaultValue)

export const StudentProvider = ({ children }: PropsWithChildren) => {
  const [classId, setClassId] = useState<string>()

  const { students } = useGetStudents(classId)
  const value = useMemo(() => {
    return students ? { students, setClassId, classId } : { students: [], setClassId, classId }
  }, [students, classId])
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export const useStudentContext = () => {
  const context = useContext(StudentContext)
  if (!context) {
    return studentDefaultValue
  }
  return context
}

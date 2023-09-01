import { QueryDocumentSnapshot } from "firebase/firestore"
import { Student } from 'models/student'

export const formatStudentSnapshot = (docs: Array<QueryDocumentSnapshot<any>>): { students: Student[], deletedStudents: Student[] } => {
    return docs.sort((snapA, snapB) => snapA.data()?.firstName.localeCompare(snapB.data()?.firstName))
    .reduce(
      (acc: { students: Student[]; deletedStudents: Student[] }, data) => {
        const stu = data.data() as Student
        if (!stu.isDeleted) {
          return { ...acc, students: [...acc.students, { ...stu, id: data.id }] }
        }
        if (stu.isDeleted) {
          return {
            ...acc,
            deletedStudents: [...acc.deletedStudents, { ...stu, id: data.id }],
          }
        }
        return acc
      },
      { students: [], deletedStudents: [] }
    )
}
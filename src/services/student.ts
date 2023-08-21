import { fireStoreDB } from '../firebase'
import { useState, useEffect } from 'react'
import {
  addDoc,
  doc,
  getDocs,
  query,
  collection,
  onSnapshot,
  writeBatch,
  where,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore'
import { Student } from 'models'

const StudentCollection = 'students'
export const studentRef = collection(fireStoreDB, StudentCollection)
export const useGetStudents = (classId: string) => {
  const [students, setStudents] = useState<Student[] | null>()
  const [deletedStudents, setDeletedStudents] = useState<Student[]>([])
  const [listener, setListener] = useState<Unsubscribe>()
  useEffect(() => {
    if (classId) {
      const queryStudents = query(studentRef, where('class.id', '==', classId))
      const listenerData = onSnapshot(
        queryStudents,
        (snapshot) => {
          const groupStudents: { students: Student[]; deletedStudents: Student[] } = snapshot.docs
            .sort((snapA, snapB) => snapA.data()?.firstName.localeCompare(snapB.data()?.firstName))
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
          setStudents(groupStudents.students)
          setDeletedStudents(groupStudents.deletedStudents)
        },
        (error) => {
          console.error(error)
          setStudents(null)
        }
      )
      setListener(() => listenerData)
      return listenerData
    }
  }, [classId])

  useEffect(() => {
    if (listener && students) {
      console.log('stop listener when class change')
      listener()
      setListener(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  return { students, isLoading: typeof students === 'undefined', listener, deletedStudents }
}

export const useGetStudentById = (id: string) => {
  const [student, setStudent] = useState<Student | null>()
  useEffect(() => {
    if (id) {
      const queryStudents = doc(studentRef, id)
      const listener = onSnapshot(
        queryStudents,
        (snapshot) => {
          if (snapshot.exists()) {
            const value = { ...snapshot.data(), id: snapshot.id } as Student
            setStudent(value)
          }
        },
        (error) => {
          console.error(error)
          setStudent(null)
        }
      )
      return () => listener()
    }
  }, [id])
  return { student, isLoading: typeof student === 'undefined' }
}

interface AddNewStudentParams {
  dataInput: Omit<Student, 'id'>
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useAddNewStudent = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: AddNewStudentParams) => {
    const data = {
      ...dataInput,
      createdDate: serverTimestamp(),
    }
    addDoc(collection(fireStoreDB, StudentCollection), data)
      .then((value) => {
        console.info(value)
        onSuccess()
      })
      .catch((error) => {
        console.error(error)
        onError()
      })
      .finally(() => {
        onComplete()
      })
  }
}

interface BatchAddStudentsParams {
  students: Omit<Student, 'id'>[]
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useBatchAddStudents = () => {
  return async ({ students, onSuccess, onError, onComplete }: BatchAddStudentsParams) => {
    const batch = writeBatch(fireStoreDB)
    students.forEach((student) => {
      const docRef = doc(collection(fireStoreDB, StudentCollection))
      batch.set(docRef, {
        ...student,
        isDeleted: false,
        createdDate: serverTimestamp(),
        schoolYears: ['2022-2023'],
      })
    })
    await batch
      .commit()
      .then((value) => {
        console.table(value)
        onSuccess()
      })
      .catch((error) => {
        console.error(error)
        onError()
      })
      .finally(() => onComplete())
  }
}

interface UpdateStudentParams {
  dataInput: Student
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const restoreStudent = (studentId: string) => {
  const ref = doc(fireStoreDB, StudentCollection, studentId)
  if (!studentId) {
    return Promise.reject('Invalid Data')
  }
  return updateDoc(ref, {
    updatedDate: serverTimestamp(),
    isDeleted: false,
  })
}

export const useUpdateStudent = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: UpdateStudentParams) => {
    const ref = doc(fireStoreDB, StudentCollection, dataInput.id)
    updateDoc(ref, {
      updatedDate: serverTimestamp(),
      ...dataInput,
      note: dataInput.note || '',
      grade: dataInput.grade || '',
      saintName: dataInput.saintName || '',
      address: dataInput.address || '',
      firstName: dataInput.firstName.toUpperCase(),
    })
      .then(() => {
        onSuccess()
      })
      .catch((error) => {
        console.error(error)
        onError()
      })
      .finally(() => {
        onComplete()
      })
  }
}

interface DeleteStudentParams {
  id: string
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useDeleteStudent = () => {
  return ({ id, onSuccess, onError, onComplete }: DeleteStudentParams) => {
    const ref = doc(fireStoreDB, StudentCollection, id)
    updateDoc(ref, { isDeleted: true, updatedDate: serverTimestamp() })
      .then((value) => {
        console.info(value)
        onSuccess()
      })
      .catch((error) => {
        console.error(error)
        onError()
      })
      .finally(() => {
        onComplete()
      })
  }
}

export const updateSchoolYearForAllStudent = () => {
  const ref = collection(fireStoreDB, StudentCollection)
  return getDocs(ref).then((snapshot) => {
    snapshot.docs.forEach((snapshotDoc) => {
      updateDoc(snapshotDoc.ref, { schoolYears: ['2020-2021'] }).then((result) =>
        console.log(result)
      )
    })
  })
}

export const removeAllStudent = () => {
  const ref = collection(fireStoreDB, StudentCollection)
  return getDocs(query(ref, where('class.id', '==', 'vd'))).then((res) => {
    res.forEach((snapDoc) => {
      deleteDoc(doc(fireStoreDB, StudentCollection, snapDoc.id)).then((delDoc) =>
        console.log({ delDoc })
      )
    })
    console.log({ length: res.docs.length })
  })
}

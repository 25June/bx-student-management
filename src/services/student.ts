import { fireStoreDB } from '../firebase'
import { useState, useEffect } from 'react'
import {
  addDoc,
  doc,
  query,
  collection,
  onSnapshot,
  writeBatch,
  where,
  serverTimestamp,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore'
import { Student } from 'models'

const StudentCollection = 'students'
export const studentRef = collection(fireStoreDB, StudentCollection)
export const useGetStudents = (classId: string) => {
  const [students, setStudents] = useState<Student[] | null>()
  const [listener, setListener] = useState<Unsubscribe>()
  useEffect(() => {
    console.log({ classId })
    if (classId) {
      const queryStudents = query(studentRef, where('class.id', '==', classId))
      const listenerData = onSnapshot(
        queryStudents,
        (snapshot) => {
          setStudents(
            snapshot.docs.reduce((acc: Student[], data) => {
              if (!(data.data() as Student).isDeleted) {
                return [...acc, { ...data.data(), id: data.id } as Student]
              }
              return acc
            }, [])
          )
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

  return { students, isLoading: typeof students === 'undefined', listener }
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
      batch.set(docRef, { ...student, isDeleted: false, createdDate: serverTimestamp() })
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

export const useUpdateStudent = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: UpdateStudentParams) => {
    console.log(dataInput)
    const ref = doc(fireStoreDB, StudentCollection, dataInput.id)
    updateDoc(ref, { updatedDate: serverTimestamp(), ...dataInput })
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

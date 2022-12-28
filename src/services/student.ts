import { app } from '../firebase'
import { useState, useEffect } from 'react'
import {
  addDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  getFirestore,
  collection,
  onSnapshot,
  writeBatch,
  limit,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { Student } from 'models'

const db = getFirestore(app)
const StudentCollection = 'students'
const studentRef = collection(db, StudentCollection)

export const useGetStudents = () => {
  const [students, setStudents] = useState<Student[] | null>()
  useEffect(() => {
    const queryStudents = query(studentRef, limit(100))
    onSnapshot(
      queryStudents,
      (snapshot) => {
        setStudents(
          snapshot.docs.map(
            (data: QueryDocumentSnapshot<DocumentData>) =>
              ({ ...data.data(), id: data.id } as Student)
          )
        )
      },
      (error) => {
        console.error(error)
        setStudents(null)
      }
    )
  }, [])
  return { students, isLoading: typeof students === 'undefined' }
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
    addDoc(collection(db, StudentCollection), data)
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
    const batch = writeBatch(db)
    students.forEach((student) => {
      const docRef = doc(collection(db, StudentCollection))
      batch.set(docRef, student)
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
    const ref = doc(db, StudentCollection, dataInput.id)
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
  dataInput: Student
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useDeleteStudent = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: DeleteStudentParams) => {
    console.log(dataInput)
    const ref = doc(db, StudentCollection, dataInput.id)
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

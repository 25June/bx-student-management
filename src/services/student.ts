import { app } from '../firebase'
import { useState, useEffect } from 'react'
import {
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  getFirestore,
  collection,
  onSnapshot,
} from 'firebase/firestore'
import { Student } from '../models/student'

const db = getFirestore(app)
const StudentCollection = 'student'
const studentRef = collection(db, StudentCollection)

export const useGetStudents = () => {
  const [students, setStudents] = useState<Student[] | null>()
  useEffect(() => {
    const queryStudents = query(studentRef)
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
  }, [db])
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
    console.log(dataInput)
    addDoc(collection(db, StudentCollection), dataInput)
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

interface UpdateStudentParams {
  dataInput: Student
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useUpdateStudent = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: UpdateStudentParams) => {
    console.log(dataInput)
    setDoc(doc(db, StudentCollection, dataInput.id), dataInput)
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
    deleteDoc(doc(db, StudentCollection, dataInput.id))
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

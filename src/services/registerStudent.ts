import { addDoc, collection, serverTimestamp, query, onSnapshot } from 'firebase/firestore'
import { fireStoreDB } from '../firebase'
import { RegisterStudent } from 'models/student'
import { useState, useEffect } from 'react'

const StudentRegisterCollection = 'newRegister'
export const newRegisterRef = collection(fireStoreDB, StudentRegisterCollection)

interface AddNewStudentParams {
  dataInput: Omit<RegisterStudent, 'id'>
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useRegisterNewStudent = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: AddNewStudentParams) => {
    const data = {
      ...dataInput,
      createdDate: serverTimestamp(),
    }
    addDoc(collection(fireStoreDB, StudentRegisterCollection), data)
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

export const useGetNewRegisterStudent = () => {
  const [registerStudents, setRegisterStudent] = useState<RegisterStudent[] | null>()
  useEffect(() => {
    const queryNewRegisterStudents = query(newRegisterRef)
    const listener = onSnapshot(
      queryNewRegisterStudents,
      (snapshot) => {
        setRegisterStudent(
          snapshot.docs.map((snap) => {
            return {
              ...snap.data(),
              id: snap.id,
            } as RegisterStudent
          })
        )
      },
      (error) => {
        console.error(error)
        setRegisterStudent(null)
      }
    )
    return listener
  }, [])

  return { registerStudents, isLoading: typeof registerStudents === 'undefined' }
}

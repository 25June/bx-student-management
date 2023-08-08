import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { fireStoreDB } from '../firebase'
import { RegisterStudent } from 'models/student'

const StudentRegisterCollection = 'newRegister'

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

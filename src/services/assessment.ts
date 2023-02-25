import { useState, useEffect } from 'react'
import { Assessment } from 'models'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { app } from '../firebase'

const db = getFirestore(app)
const AssessmentCollection = 'assessments'
const assessmentRef = collection(db, AssessmentCollection)

export const useGetAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>()
  useEffect(() => {
    const queryAssessments = query(assessmentRef, limit(100))
    onSnapshot(queryAssessments, (snapshot) => {
      setAssessments(
        snapshot.docs
          .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
          .filter((assessment) => !assessment.isDeleted)
      )
      console.log(
        snapshot.docs
          .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
          .filter((assessment) => !assessment.isDeleted)
      )
    })
  }, [])
  return { assessments, isLoading: typeof assessments === 'undefined' }
}

interface AddNewAssessmentProps {
  dataInput: Omit<Assessment, 'id'>
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useAddNewAssessment = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: AddNewAssessmentProps) => {
    const time = serverTimestamp() as Timestamp
    const data = {
      ...dataInput,
      createdDate: time,
    }
    addDoc(collection(db, AssessmentCollection), data)
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

interface EditAssessmentProps {
  dataInput: Assessment
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useEditAssessment = () => {
  return ({ dataInput, onSuccess, onError, onComplete }: EditAssessmentProps) => {
    const ref = doc(db, AssessmentCollection, dataInput.id)
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

interface DeleteAssessmentParams {
  id: string
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useDeleteAssessment = () => {
  return ({ id, onSuccess, onError, onComplete }: DeleteAssessmentParams) => {
    const ref = doc(db, AssessmentCollection, id)
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

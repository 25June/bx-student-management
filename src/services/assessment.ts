import { useState, useEffect } from 'react'
import { Assessment } from 'models'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  where,
  query,
  serverTimestamp,
  updateDoc,
  Timestamp,
  getDocs,
} from 'firebase/firestore'
import { app } from '../firebase'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useClassContext } from 'contexts/ClassContext'

const db = getFirestore(app)
const AssessmentCollection = 'assessments'
const assessmentRef = collection(db, AssessmentCollection)

export const useGetAssessments = (classId: string) => {
  const [assessments, setAssessments] = useState<Assessment[]>()
  const { showSnackbar } = useSnackbarContext()
  useEffect(() => {
    if (classId) {
      const queryAssessments = query(assessmentRef, where('classId', '==', classId))
      getDocs(queryAssessments).then((snapshot) => {
        if (snapshot.empty) {
          showSnackbar(`Get Assessments empty for class ${classId}`, 'warning')
          setAssessments([])
          return
        }
        setAssessments(
          snapshot.docs
            .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
            .filter((assessment) => !assessment.isDeleted)
        )
        showSnackbar('Get Assessments Success', 'success')
      })
    }
  }, [classId, showSnackbar])

  return { assessments, isLoading: typeof assessments === 'undefined' }
}

interface AddNewAssessmentProps {
  dataInput: Omit<Assessment, 'id'>
  onSuccess: () => void
  onError: () => void
  onComplete: () => void
}

export const useAddNewAssessment = () => {
  const { classId } = useClassContext()
  return ({ dataInput, onSuccess, onError, onComplete }: AddNewAssessmentProps) => {
    const time = serverTimestamp() as Timestamp
    const data = {
      ...dataInput,
      createdDate: time,
      classId,
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

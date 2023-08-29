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
import { useClassContext } from 'contexts/ClassContext'

const db = getFirestore(app)
const AssessmentCollection = 'assessments'
const assessmentRef = collection(db, AssessmentCollection)

export const updateAllValueOfAssessment = () => {
  const queryAssessments = query(assessmentRef)
  getDocs(queryAssessments).then((snapshot) => {
    snapshot.docs.forEach((snapshotDoc) => {
      updateDoc(snapshotDoc.ref, { schoolYear: '2022-2023' }).then((result) => console.log(result))
    })

    if (snapshot.empty) {
      return []
    }
    return snapshot.docs
      .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
      .filter((assessment) => !assessment.isDeleted)
  })
}

export const fetchAssessments = (classId: string, schoolYear: string) => {
  const queryAssessments = query(
    assessmentRef,
    where('classId', '==', classId),
    where('schoolYear', '==', schoolYear)
  )
  return getDocs(queryAssessments).then((snapshot) => {
    if (snapshot.empty) {
      return []
    }
    return snapshot.docs
      .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
      .filter((assessment) => !assessment.isDeleted)
  })
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

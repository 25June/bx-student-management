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
import { AssessmentEnum } from 'constant/common'

const db = getFirestore(app)
const AssessmentCollection = 'assessments'
const assessmentRef = collection(db, AssessmentCollection)

export const updateAllValueOfAssessment = () => {
  const queryAssessments = query(assessmentRef)
  getDocs(queryAssessments).then((snapshot) => {
    snapshot.docs.forEach((snapshotDoc) => {
      let score
      switch (snapshotDoc.data().type) {
        case AssessmentEnum.KT5:
          score = 'score5'
          break
        case AssessmentEnum.KT15:
          score = 'score15'
          break
        case AssessmentEnum.KT45:
          score = 'score45'
          break
        case AssessmentEnum.KT60:
          score = 'score60'
          break
        default:
          break
      }
      if (score) {
        updateDoc(snapshotDoc.ref, { type: score }).then((result) => console.log(result))
      }
    })

    if (snapshot.empty) {
      return []
    }
    return snapshot.docs
      .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
      .filter((assessment) => !assessment.isDeleted)
  })
}

export const fetchAssessments = (classId: string) => {
  const queryAssessments = query(assessmentRef, where('classId', '==', classId))
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

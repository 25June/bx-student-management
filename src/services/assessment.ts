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

const db = getFirestore(app)
const AssessmentCollection = 'assessments'
const assessmentRef = collection(db, AssessmentCollection)

// export const updateAllValueOfAssessment = () => {
//   const queryAssessments = query(assessmentRef)
//   getDocs(queryAssessments).then((snapshot) => {
//     snapshot.docs.forEach((snapshotDoc) => {
//       updateDoc(snapshotDoc.ref, { semesterId: 'hk1' })
//         .then((res) => console.log({ status: 'success', res, id: snapshotDoc.id }))
//         .catch((err) => console.log({ status: 'error', err, id: snapshotDoc.id }))
//     })

//     if (snapshot.empty) {
//       return []
//     }
//     return snapshot.docs
//       .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
//       .filter((assessment) => !assessment.isDeleted)
//   })
// }

// export const getAllAssessments = () => {
//   const queryAssessments = query(assessmentRef)
//   return getDocs(queryAssessments)
//     .then((snapshot) => {
//       return snapshot.docs.map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id }))
//     })
//     .then((data) => console.log({ data }))
// }

export const fetchAssessments = (classId: string, schoolYear: string, semesterId: string) => {
  const queryAssessments = query(
    assessmentRef,
    where('classId', '==', classId),
    where('schoolYear', '==', schoolYear),
    where('semesterId', '==', semesterId)
  )
  return getDocs(queryAssessments).then((snapshot) => {
    if (snapshot.empty) {
      return []
    }
    return snapshot.docs
      .map((snapshotDoc) => ({ ...snapshotDoc.data(), id: snapshotDoc.id } as Assessment))
      .filter((assessment) => !assessment.isDeleted)
      .sort((a, b) => (a.bookDate > b.bookDate ? -1 : 1))
  })
}

interface AddNewAssessmentProps {
  dataInput: Omit<Assessment, 'id'>
  onSuccess?: () => void
  onError?: () => void
  onComplete?: () => void
}

export const useAddNewAssessment = () => {
  const { showSnackbar } = useSnackbarContext()

  return ({ dataInput, onSuccess, onError, onComplete }: AddNewAssessmentProps) => {
    const time = serverTimestamp() as Timestamp
    const data = {
      ...dataInput,
      createdDate: time,
    }
    addDoc(collection(db, AssessmentCollection), data)
      .then(() => {
        showSnackbar(`Thêm Bài Kiểm Tra Thành Công`, 'success')
        onSuccess?.()
      })
      .catch((error) => {
        console.error(error)
        showSnackbar(`Thêm Bài Kiểm Tra Thất Bại`, 'error')
        onError?.()
      })
      .finally(() => {
        onComplete?.()
      })
  }
}

interface EditAssessmentProps {
  dataInput: Assessment
  onSuccess?: () => void
  onError?: () => void
  onComplete?: () => void
}

export const useEditAssessment = () => {
  const { showSnackbar } = useSnackbarContext()

  return ({ dataInput, onSuccess, onError, onComplete }: EditAssessmentProps) => {
    const ref = doc(db, AssessmentCollection, dataInput.id)
    updateDoc(ref, { updatedDate: serverTimestamp(), ...dataInput })
      .then(() => {
        showSnackbar(`Cập Nhật Bài Kiểm Tra Thành Công`, 'success')
        onSuccess?.()
      })
      .catch((error) => {
        console.error(error)
        showSnackbar(`Cập Nhật Bài Kiểm Tra Thất Bại`, 'error')
        onError?.()
      })
      .finally(() => {
        onComplete?.()
      })
  }
}

interface DeleteAssessmentProps {
  id: string
  onSuccess?: () => void
  onError?: () => void
  onComplete?: () => void
}

export const useDeleteAssessment = () => {
  const { showSnackbar } = useSnackbarContext()

  return ({ id, onSuccess, onError, onComplete }: DeleteAssessmentProps) => {
    const ref = doc(db, AssessmentCollection, id)
    updateDoc(ref, { isDeleted: true, updatedDate: serverTimestamp() })
      .then(() => {
        showSnackbar(`Xoá Bài Kiểm Tra Thành Công`, 'success')
        onSuccess?.()
      })
      .catch((error) => {
        console.error(error)
        showSnackbar(`Xoá Bài Kiểm Tra vào Thất Bại`, 'error')
        onError?.()
      })
      .finally(() => {
        onComplete?.()
      })
  }
}

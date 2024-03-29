import { realtimeDB } from '../firebase'
import { useState, useEffect } from 'react'
import { ScoreBook } from 'models/ScoreBook'
import { onValue, ref, get, set, Unsubscribe } from 'firebase/database'
import { useClassContext } from 'contexts/ClassContext'

const scorebookPathName = (classId: string, year: string, semester: string) =>
  `scorebook/${classId}/${year}/${semester}`

export const useGetStudentScoreBooks = () => {
  const { classId, semesterId, schoolYearId } = useClassContext()
  const [studentScoreBooks, setStudentScoreBooks] = useState<Record<string, ScoreBook> | null>()
  const [listener, setListener] = useState<Unsubscribe>()
  useEffect(() => {
    if (classId) {
      const subscribe = onValue(
        ref(realtimeDB, scorebookPathName(classId, schoolYearId, semesterId)),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            setStudentScoreBooks(data)
            return
          }
          setStudentScoreBooks(null)
        }
      )
      setListener(() => subscribe)
      return subscribe
    }
  }, [classId, schoolYearId, semesterId])

  useEffect(() => {
    if (classId && listener) {
      listener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, schoolYearId, semesterId])

  return { studentScoreBooks, isLoading: typeof studentScoreBooks === 'undefined' }
}

interface GetStudentScoreBookProps {
  classId: string
  semesterId: string
  schoolYearId: string
  studentId: string
}

const studentScoreBookPathName = (
  classId: string,
  year: string,
  semester: string,
  studentId: string
) => `scorebook/${classId}/${year}/${semester}/${studentId}`
export const getStudentScoreBook = ({
  classId,
  schoolYearId,
  semesterId,
  studentId,
}: GetStudentScoreBookProps) => {
  if (classId && schoolYearId && semesterId && studentId) {
    return get(
      ref(realtimeDB, studentScoreBookPathName(classId, schoolYearId, semesterId, studentId))
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          return { ...snapshot.val(), id: snapshot.key }
        }
        return 'EMPTY_DATA'
      })
      .catch((error) => {
        console.error(error, 'error')
        return null
      })
  }
  return Promise.reject('Invalid Data')
}

interface SetNewStudentScoreProps {
  score: number
  assessmentId: string
  studentId: string
  type: string
  classId: string
  semesterId: string
  schoolYearId: string
}

const scorePathName = (
  classId: string,
  year: string,
  semester: string,
  studentId: string,
  type: string,
  assessmentId: string
) => `scorebook/${classId}/${year}/${semester}/${studentId}/${type}/${assessmentId}`

export const setNewStudentScore = ({
  score,
  assessmentId,
  semesterId,
  studentId,
  classId,
  schoolYearId,
  type,
}: SetNewStudentScoreProps) => {
  if (
    typeof score === 'number' &&
    assessmentId &&
    semesterId &&
    studentId &&
    classId &&
    schoolYearId &&
    type
  ) {
    return set(
      ref(
        realtimeDB,
        scorePathName(classId, schoolYearId, semesterId, studentId, type, assessmentId)
      ),
      score
    )
  }
  return Promise.reject('Invalid Data')
}

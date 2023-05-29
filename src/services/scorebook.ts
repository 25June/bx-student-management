import { realtimeDB } from '../firebase'
import { useState, useEffect } from 'react'
import { Assessment } from 'models'
import { ScoreBook } from 'models/ScoreBook'

import { useAssessmentContext } from 'contexts/AssessmentContext'
import { AssessmentEnum } from 'constant/common'
import { onValue, ref, get, set, Unsubscribe } from 'firebase/database'
import { useSnackbarContext } from 'contexts/SnackbarContext'

const initDefaultScoreBook = (assessments: Assessment[]) => {
  return assessments.reduce(
    (acc, cur) => {
      if (cur.type === AssessmentEnum.KT5) {
        return {
          ...acc,
          score5: {
            ...acc.score5,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === AssessmentEnum.KT15) {
        return {
          ...acc,
          score15: {
            ...acc.score15,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === AssessmentEnum.KT45) {
        return {
          ...acc,
          score45: {
            ...acc.score45,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === AssessmentEnum.KT60) {
        return {
          ...acc,
          score60: {
            ...acc.score60,
            [cur.id]: 0,
          },
        }
      }
      return acc
    },
    {
      score5: {},
      score15: {},
      score45: {},
      score60: {},
    }
  )
}

interface GetStudentScoreBooks1Props {
  classId: string
  semester?: string
  year?: string
}

const scorebookPathName = (classId: string, year: string, semester: string) =>
  `scorebook/${classId}/${year}/${semester}`

export const useGetStudentScoreBooks1 = ({
  classId,
  semester = 'hk1',
  year = '2022-2023',
}: GetStudentScoreBooks1Props) => {
  const [studentScoreBooks, setStudentScoreBooks] = useState<Record<string, ScoreBook> | null>()
  const [listener, setListener] = useState<Unsubscribe>()
  useEffect(() => {
    if (classId) {
      const subscribe = onValue(
        ref(realtimeDB, scorebookPathName(classId, year, semester)),
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
  }, [classId, year, semester])

  useEffect(() => {
    if (listener) {
      listener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, semester])

  return { studentScoreBooks, isLoading: typeof studentScoreBooks === 'undefined' }
}

interface GetStudentScoreBookProps {
  classId: string
  semester?: string
  year?: string
  studentId: string
}

const studentScoreBookPathName = (
  classId: string,
  year: string,
  semester: string,
  studentId: string
) => `scorebook/${classId}/${year}/${semester}/${studentId}`
export const useGetStudentScoreBook1 = () => {
  const { showSnackbar } = useSnackbarContext()
  const { assessments } = useAssessmentContext()

  return ({
    classId,
    year = '2022-2023',
    semester = 'hk1',
    studentId,
  }: GetStudentScoreBookProps) => {
    return get(ref(realtimeDB, studentScoreBookPathName(classId, year, semester, studentId)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          showSnackbar('Student scorebook has been fetch', 'success')
          return { ...snapshot.val(), id: snapshot.key }
        } else {
          showSnackbar('No data available', 'warning')
          return initDefaultScoreBook(assessments)
        }
      })
      .catch((error) => {
        showSnackbar(error, 'error')
      })
  }
}

interface SetNewStudentScoreProps {
  score: number
  assessmentId: string
  studentId: string
  type: string
  classId: string
  semester?: string
  year?: string
}

const scorePathName = (
  classId: string,
  year: string,
  semester: string,
  studentId: string,
  type: string,
  assessmentId: string
) => `scorebook/${classId}/${year}/${semester}/${studentId}/${type}/${assessmentId}`

export const useSetNewStudentScore1 = () => {
  const { showSnackbar } = useSnackbarContext()
  return ({
    score,
    assessmentId,
    semester = 'hk1',
    studentId,
    classId,
    year = '2022-2023',
    type,
  }: SetNewStudentScoreProps) => {
    if (score && assessmentId && semester && studentId && classId && year && type) {
      return set(
        ref(realtimeDB, scorePathName(classId, year, semester, studentId, type, assessmentId)),
        score
      )
        .then(() => showSnackbar(`${score} has been added to ${studentId}`, 'success'))
        .catch((error: any) => showSnackbar(error, 'error'))
    }
    return Promise.reject('Invalid Data')
  }
}

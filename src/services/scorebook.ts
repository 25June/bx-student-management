import { fireStoreDB } from '../firebase'
import { useState, useEffect } from 'react'
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  Unsubscribe,
  where,
  documentId,
  query,
} from 'firebase/firestore'
import { Assessment, Student, StudentScoreBooks } from 'models'
import { ScoreBook } from 'models/ScoreBook'

import { useAssessmentContext } from 'contexts/AssessmentContext'
import { AssessmentEnum } from 'constant/common'

const ScoreBookCollection = 'scoreBooks'
const scoreBookRef = collection(fireStoreDB, ScoreBookCollection)
const studentScoreBookRef = (studentId: string) => doc(fireStoreDB, ScoreBookCollection, studentId)

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

const getDefaultScoreBook = (studentId: string): ScoreBook => {
  return {
    id: studentId,
    score5: {},
    score15: {},
    score45: {},
    score60: {},
  }
}

interface ChunkingFormatProps {
  studentIds: string[]
  studentSliceArr: Student[]
  chunks: {
    studentIds: string[]
    studentSliceArr: Student[]
  }[]
}

const ChunkingFormatDefaultValue = { studentIds: [], studentSliceArr: [], chunks: [] }
const chunkingScoreBook = (students: Student[]) => {
  return students.reduce(
    (acc: ChunkingFormatProps, cur: Student, curIndex: number): ChunkingFormatProps => {
      if (curIndex === students.length - 1) {
        return {
          studentIds: [],
          studentSliceArr: [],
          chunks: acc.chunks.concat({
            studentSliceArr: [...acc.studentSliceArr, cur],
            studentIds: [...acc.studentIds, cur.id],
          }),
        }
      }
      if (acc.studentSliceArr.length === 10) {
        return {
          studentIds: [cur.id],
          studentSliceArr: [cur],
          chunks: acc.chunks.concat({
            studentSliceArr: acc.studentSliceArr,
            studentIds: acc.studentIds,
          }),
        }
      }
      return {
        ...acc,
        studentIds: [...acc.studentIds, cur.id],
        studentSliceArr: [...acc.studentSliceArr, cur],
      }
    },
    ChunkingFormatDefaultValue
  )
}

const getScoreBook = (students: Student[], setStudentScoreBooks: (state: any) => void) => {
  const { chunks } = chunkingScoreBook(students)
  return chunks.map(({ studentIds, studentSliceArr }) => {
    const ScoreBookQuery = query(scoreBookRef, where(documentId(), 'in', studentIds))
    return onSnapshot(ScoreBookQuery, (snapshot) => {
      if (snapshot.docs) {
        // const studentScoreBooks = studentSliceArr.map((student: Student) => {
        //   const scoreBook = snapshot.docs.find((data) => data.id === student.id)
        //   if (scoreBook && scoreBook.exists()) {
        //     return { ...scoreBook.data(), ...student, id: student.id }
        //   }
        //   return { ...getDefaultScoreBook(student.id), ...student, id: student.id }
        // })

        const studentScoreBooksObj = studentSliceArr.reduce((acc, student) => {
          const scoreBook = snapshot.docs.find((data) => data.id === student.id)
          if (scoreBook && scoreBook.exists()) {
            return {
              ...acc,
              [student.id]: { ...scoreBook.data(), ...student, id: student.id },
            }
          }
          return {
            ...acc,
            [student.id]: { ...getDefaultScoreBook(student.id), ...student, id: student.id },
          }
        }, {})

        setStudentScoreBooks((prevStudentScoreBooks: Record<string, StudentScoreBooks>) => {
          if (!prevStudentScoreBooks || Object.values(prevStudentScoreBooks).length === 0) {
            return studentScoreBooksObj
          }

          return { ...prevStudentScoreBooks, ...studentScoreBooksObj }
        })
        return
      }
      setStudentScoreBooks([])
      return
    })
  })
}

export const useGetStudentScoreBooks = ({
  students,
  classId,
}: {
  students: Student[]
  classId: string
}) => {
  const [studentScoreBooks, setStudentScoreBooks] = useState<Record<string, StudentScoreBooks>>()
  const [listeners, setListeners] = useState<Unsubscribe[]>()

  useEffect(() => {
    if (students.length !== 0) {
      const listenerData = getScoreBook(students, setStudentScoreBooks)
      setListeners(listenerData)
      return () => {
        console.log('unsubscribe scorebook when unmount')
        listenerData.forEach((listener) => listener())
      }
    }
  }, [students])

  useEffect(() => {
    if (listeners && studentScoreBooks) {
      console.log('unsubscribe scorebook when class Id change: ')
      listeners.forEach((listener) => listener())
      setListeners(undefined)
      setStudentScoreBooks(() => undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  return {
    studentScoreBooks: studentScoreBooks ? Object.values(studentScoreBooks) : [],
    isLoading: typeof studentScoreBooks === 'undefined',
  }
}

export const useGetStudentScoreBook = (studentId: string) => {
  const [studentScoreBook, setStudentScoreBook] = useState<ScoreBook | null>()
  useEffect(() => {
    if (studentId) {
      const studentScoreBookQuery = doc(scoreBookRef, studentId)
      onSnapshot(studentScoreBookQuery, (snapshot) => {
        if (snapshot.exists()) {
          const value = { ...snapshot.data(), id: snapshot.id } as ScoreBook
          setStudentScoreBook(value)
        } else {
          setStudentScoreBook(null)
        }
      })
    }
  }, [studentId])
  return { studentScoreBook, isLoading: typeof studentScoreBook === 'undefined' }
}

export const useInitStudentScore = () => {
  const { assessments } = useAssessmentContext()
  return async (studentId: string) => {
    if (!studentId || !assessments) {
      return Promise.reject('Invalid Data')
    }
    const reference = studentScoreBookRef(studentId)
    return setDoc(reference, initDefaultScoreBook(assessments))
  }
}

export const useSetNewStudentScore = () => {
  return (studentId: string, type: string, data: { score: number }, assessmentId: string) => {
    if (!(studentId || type || data)) {
      return Promise.reject('Invalid Data')
    }
    const reference = studentScoreBookRef(studentId)
    return setDoc(reference, { [type]: { [assessmentId]: data.score } }, { merge: true })
  }
}

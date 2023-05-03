import { app } from '../firebase'
import { useState, useEffect } from 'react'
import { doc, getFirestore, collection, onSnapshot, setDoc } from 'firebase/firestore'
import { Assessment, ScoreBook, Student, StudentScoreBooks } from 'models'

import { useAssessmentContext } from 'contexts/AssessmentContext'

const db = getFirestore(app)
const ScoreBookCollection = 'scoreBooks'
const scoreBookRef = collection(db, ScoreBookCollection)
const studentScoreBookRef = (studentId: string) => doc(db, ScoreBookCollection, studentId)

const initDefaultScoreBook = (assessments: Assessment[]) => {
  return assessments.reduce(
    (acc, cur) => {
      if (cur.type === 'KT5') {
        return {
          ...acc,
          score5: {
            ...acc.score5,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === 'KT15') {
        return {
          ...acc,
          score15: {
            ...acc.score15,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === 'KT45') {
        return {
          ...acc,
          score45: {
            ...acc.score45,
            [cur.id]: 0,
          },
        }
      }
      if (cur.type === 'KT60') {
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

const getScoreBook = (
  studentId: string,
  addScoreBook: (scoreBook: ScoreBook) => any,
  setStudentScoreBooks: (state: any) => void
) => {
  const query = doc(db, ScoreBookCollection, studentId)
  return onSnapshot(query, (snapshot) => {
    let finalData: StudentScoreBooks
    if (snapshot.exists()) {
      finalData = addScoreBook({ ...snapshot.data(), id: snapshot.id } as ScoreBook)
      setStudentScoreBooks((prevScoreBooks: Record<string, StudentScoreBooks>) => {
        return { ...prevScoreBooks, [snapshot.id]: finalData }
      })
      return
    }
    finalData = addScoreBook(getDefaultScoreBook(studentId))
    setStudentScoreBooks((prevScoreBooks: Record<string, StudentScoreBooks>) => {
      return { ...prevScoreBooks, [studentId]: finalData }
    })
    return
  })
}

const formatData = (student: Student) => {
  return (scoreBook: ScoreBook): StudentScoreBooks => {
    return { ...student, ...scoreBook }
  }
}

export const useGetStudentScoreBooks = ({ students }: { students: Student[] }) => {
  const [studentScoreBooks, setStudentScoreBooks] = useState<Record<string, StudentScoreBooks>>({})
  useEffect(() => {
    if (students.length !== 0) {
      const listeners = students.map((stu) => {
        return getScoreBook(stu.id, formatData(stu), setStudentScoreBooks)
      })
      // unsubscribe step
      return () => listeners.forEach((listener) => listener())
    }
  }, [students])
  return {
    studentScoreBooks: Object.values(studentScoreBooks),
    isLoading: typeof studentScoreBooks === 'undefined',
  }
}

export const useGetStudentScoreBook = (studentId: string) => {
  const [studentScoreBook, setStudentScoreBook] = useState<ScoreBook | null>()
  useEffect(() => {
    if (studentId) {
      const query = doc(scoreBookRef, studentId)
      onSnapshot(query, (snapshot) => {
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
      .then((res) => {
        return res
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export const useSetNewStudentScore = () => {
  return (studentId: string, type: string, data: { score: number }, assessmentId: string) => {
    if (!(studentId || type || data)) {
      return Promise.reject('Invalid Data')
    }
    console.log({ studentId, type, data })
    const reference = studentScoreBookRef(studentId)
    return setDoc(reference, { [type]: { [assessmentId]: data.score } }, { merge: true })
      .then((res) => {
        console.log(res)
        console.log('success')
      })
      .catch((error) => {
        console.log(error)
        console.log('error')
      })
      .finally(() => console.log('request completed'))
  }
}

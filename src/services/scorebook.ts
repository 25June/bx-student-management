import { app } from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from 'react'
import { doc, getFirestore, collection, onSnapshot, setDoc } from 'firebase/firestore'
import { ScoreBook, Student, StudentScoreBooks } from 'models'

import { useGetStudents } from 'services/student'

const db = getFirestore(app)
const ScoreBookCollection = 'scoreBooks'
const scoreBookRef = collection(db, ScoreBookCollection)
const studentScoreBookRef = (studentId: string) => doc(db, ScoreBookCollection, studentId)

const getDefaultScoreBook = (studentId: string): ScoreBook => {
  return {
    id: studentId,
    score5: {
      [uuidv4()]: 0,
      [uuidv4()]: 0,
    },
    score15: {
      [uuidv4()]: 0,
      [uuidv4()]: 0,
    },
    score45: {
      [uuidv4()]: 0,
      [uuidv4()]: 0,
    },
    score60: {
      [uuidv4()]: 0,
      [uuidv4()]: 0,
    },
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

export const useGetStudentScoreBooks = () => {
  const { students } = useGetStudents()
  const [studentScoreBooks, setStudentScoreBooks] = useState<Record<string, StudentScoreBooks>>({})
  useEffect(() => {
    if (typeof students !== 'undefined') {
      const listeners = (students || []).map((stu) => {
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
  const [studentScoreBook, setStudentScoreBook] = useState<ScoreBook>()
  useEffect(() => {
    if (studentId) {
      const query = doc(scoreBookRef, studentId)
      onSnapshot(query, (snapshot) => {
        if (snapshot.exists()) {
          const value = { ...snapshot.data(), id: snapshot.id } as ScoreBook
          setStudentScoreBook(value)
        }
      })
    }
  }, [studentId])
  return { studentScoreBook, isLoading: typeof studentScoreBook === 'undefined' }
}

export const useSetNewStudentScore = () => {
  return (studentId: string, type: string, data: { score: number }, assessmentId: string) => {
    if (!(studentId || type || data)) {
      return
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

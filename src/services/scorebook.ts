import { app } from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from 'react'
import { doc, getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { ScoreBook, Student } from 'models'

import { useGetStudents } from 'services/student'
import { getToday } from 'utils'

const db = getFirestore(app)
const ScoreBookCollection = 'scoreBooks'
const scoreBookRef = collection(db, ScoreBookCollection)

const getDefaultScoreBook = (studentId: string): ScoreBook => {
  return {
    id: uuidv4(),
    studentId,
    score5: {
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
    },
    score15: {
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
    },
    score45: {
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
    },
    score60: {
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
      [uuidv4()]: {
        score: 10,
        bookDate: getToday(),
      },
    },
  }
}

const getScoreBook = (
  studentId: string,
  addScoreBook: (scoreBook: any) => any,
  setStudentScoreBooks: (state: any) => void
) => {
  const query = doc(scoreBookRef)
  return onSnapshot(query, (snapshot) => {
    let finalData: StudentScoreBooks
    if (snapshot.exists()) {
      finalData = addScoreBook({ ...snapshot.data(), id: snapshot.id })
      setStudentScoreBooks((prevScoreBooks: StudentScoreBooks[] = []) =>
        prevScoreBooks.concat(finalData)
      )
      return
    }
    finalData = addScoreBook(getDefaultScoreBook(studentId))
    setStudentScoreBooks((prevScoreBooks: StudentScoreBooks[] = []) =>
      prevScoreBooks.concat(finalData)
    )
    return
  })
}

type StudentScoreBooks = Student & ScoreBook

const formatData = (student: Student) => {
  return (scoreBook: ScoreBook): StudentScoreBooks => {
    return { ...student, ...scoreBook }
  }
}

export const useGetStudentScoreBooks = () => {
  const { students } = useGetStudents()
  const [studentScoreBooks, setStudentScoreBooks] = useState<StudentScoreBooks[]>()
  useEffect(() => {
    if (students && students.length !== 0 && typeof studentScoreBooks === 'undefined') {
      const listeners = students.map((stu) => {
        return getScoreBook(stu.id, formatData(stu), setStudentScoreBooks)
      })
      // unsubscribe step
      return () => listeners.forEach((listener) => listener())
    }
  }, [students])
  return { studentScoreBooks, isLoading: typeof studentScoreBooks === 'undefined' }
}

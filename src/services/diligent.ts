import { realtimeDB } from '../firebase'
import { onValue, ref } from 'firebase/database'
import { useState, useEffect } from 'react'

const year = '2022-2023'
export const useGetAttendanceByClassId = (classId: string) => {
  const [attendances, setAttendances] = useState<any>()

  useEffect(() => {
    if (classId) {
      onValue(ref(realtimeDB, `attendance/${classId}/${year}`), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          setAttendances(data)
          return
        }
        setAttendances(null)
      })
    }
  }, [classId])

  return { attendances, isLoading: typeof attendances === 'undefined' }
}

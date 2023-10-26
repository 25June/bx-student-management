import { realtimeDB } from '../firebase'
import { onValue, ref, set, get, update } from 'firebase/database'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AttendanceType } from 'constant/common'
import { AttendanceProps, NoteForm } from 'models/diligent'
import { useClassContext } from 'contexts/ClassContext'

const attendancePathName = (classId: string, year: string, semester: string) =>
  `attendance/${classId}/${year}/${semester}`
const rollCallPathNameWithId = (classId: string, year: string, id: string, semester: string) =>
  `rollCall/${classId}/${year}/${semester}/${id}`
const rollCallPathName = (classId: string, year: string, semester: string) =>
  `rollCall/${classId}/${year}/${semester}`

export type Attendances = Record<string, Record<string, AttendanceProps>>

export const useGetAttendanceByClassId = () => {
  const { classId, schoolYearId, semesterId } = useClassContext()
  const [attendances, setAttendances] = useState<Attendances | null>()
  useEffect(() => {
    if (classId && schoolYearId && semesterId) {
      const subscribe = onValue(
        ref(realtimeDB, attendancePathName(classId, schoolYearId, semesterId)),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()
            setAttendances(data)
            return
          }
          setAttendances(null)
        }
      )
      return () => subscribe()
    }
  }, [classId, schoolYearId, semesterId])

  return { attendances, isLoading: typeof attendances === 'undefined' }
}

export interface AddRollCallDateProps {
  date: string
  semesterId: string
  classId: string
  schoolYearId: string
}

export const addRollCallDate = ({
  date,
  schoolYearId,
  classId,
  semesterId,
}: AddRollCallDateProps) => {
  if (date && schoolYearId && classId && semesterId) {
    return set(
      ref(realtimeDB, rollCallPathNameWithId(classId, schoolYearId, uuidv4(), semesterId)),
      date
    )
  }
  return Promise.reject('Invalid Data')
}

export interface UpdateRollCallDateProps extends AddRollCallDateProps {
  id: string
  date: string
  classId: string
  schoolYearId: string
  semesterId: string
}

export const updateRollCallDate = ({
  date,
  id,
  classId,
  schoolYearId,
  semesterId,
}: UpdateRollCallDateProps) => {
  if (classId && schoolYearId && semesterId) {
    return set(ref(realtimeDB, rollCallPathNameWithId(classId, schoolYearId, id, semesterId)), date)
  }
  return Promise.reject('Invalid Data')
}

interface FetchRollCallDateProps {
  classId: string
  schoolYearId: string
  semesterId: string
}

export const fetchRollCallDates = ({
  classId,
  schoolYearId,
  semesterId,
}: FetchRollCallDateProps) => {
  if (classId && schoolYearId && semesterId) {
    return get(ref(realtimeDB, rollCallPathName(classId, schoolYearId, semesterId)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        }
        console.info('Data null')
        return null
      })
      .catch((error) => {
        console.error(error, 'error')
        return null
      })
  }
  return Promise.reject('Invalid Data')
}

interface SubmitAttendanceAllStudentsInClass {
  studentIds: string[]
  classId: string
  rollDateId: string
  attendance: boolean
  schoolYearId: string
  semesterId: string
}

export const submitAttendanceAllStudentsInClass = ({
  studentIds,
  classId,
  rollDateId,
  attendance,
  semesterId,
  schoolYearId,
}: SubmitAttendanceAllStudentsInClass) => {
  if (semesterId && schoolYearId && classId && rollDateId) {
    const updatedObj = studentIds.reduce((acc, studentId) => {
      return {
        ...acc,
        [`${attendancePathName(classId, schoolYearId, semesterId)}/${studentId}/${rollDateId}`]: {
          tl: attendance,
          gl: attendance,
        },
      }
    }, {})

    return update(ref(realtimeDB), updatedObj)
      .then(() => console.info(`Điểm danh thành công`, 'success'))
      .catch((error: any) => console.error(error, 'error'))
  }
  return Promise.reject('Invalid Data')
}

interface UpdateNoteAttendance {
  studentId: string
  classId: string
  rollDateId: string
  data: NoteForm
  schoolYearId: string
  semesterId: string
}

export const updateNoteAttendance = ({
  studentId,
  classId,
  rollDateId,
  data,
  semesterId,
  schoolYearId,
}: UpdateNoteAttendance) => {
  if (semesterId && schoolYearId && classId && studentId && rollDateId) {
    return update(
      ref(
        realtimeDB,
        `${attendancePathName(classId, schoolYearId, semesterId)}/${studentId}/${rollDateId}`
      ),
      data
    )
  }
  return Promise.reject('Invalid Data')
}

interface SubmitAttendanceProps {
  studentId: string
  classId: string
  rollDateId: string
  attendance: boolean
  isMissal: boolean
  schoolYearId: string
  semesterId: string
}

export const submitAttendance = ({
  studentId,
  classId,
  rollDateId,
  attendance,
  isMissal,
  semesterId,
  schoolYearId,
}: SubmitAttendanceProps) => {
  if (semesterId && schoolYearId && classId && studentId && rollDateId) {
    return set(
      ref(
        realtimeDB,
        `${attendancePathName(classId, schoolYearId, semesterId)}/${studentId}/${rollDateId}/${
          isMissal ? AttendanceType.THANH_LE : AttendanceType.GIAO_LY
        }`
      ),
      attendance
    )
  }
  return Promise.reject('Invalid Data')
}

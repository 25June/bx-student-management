import { realtimeDB } from '../firebase'
import { onValue, ref, set, get, update } from 'firebase/database'
import { useState, useEffect } from 'react'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { v4 as uuidv4 } from 'uuid'
import { AttendanceType } from 'constant/common'
import { AttendanceProps } from 'models/diligent'

const attendancePathName = (classId: string, year: string, semester: string) =>
  `attendance/${classId}/${year}/${semester}`
const rollCallPathNameWithId = (classId: string, year: string, id: string, semester: string) =>
  `rollCall/${classId}/${year}/${semester}/${id}`
const rollCallPathName = (classId: string, year: string, semester: string) =>
  `rollCall/${classId}/${year}/${semester}`

interface GetAttendanceByClassIdProps {
  classId: string
  year?: string
  semester?: string
}

export type Attendances = Record<string, Record<string, AttendanceProps>>

export const useGetAttendanceByClassId = ({
  classId,
  year = '2022-2023',
  semester = 'hk1',
}: GetAttendanceByClassIdProps) => {
  const [attendances, setAttendances] = useState<Attendances | null>()
  useEffect(() => {
    if (classId) {
      const subscribe = onValue(
        ref(realtimeDB, attendancePathName(classId, year, semester)),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  return { attendances, isLoading: typeof attendances === 'undefined' }
}

export interface AddRollCallDateProps {
  date: string
  year?: string
  classId: string
  semester?: string
}

export const useAddRollCallDate = () => {
  const { showSnackbar } = useSnackbarContext()
  return ({ date, year = '2022-2023', classId, semester = 'hk1' }: AddRollCallDateProps) => {
    return set(ref(realtimeDB, rollCallPathNameWithId(classId, year, uuidv4(), semester)), date)
      .then(() => showSnackbar(`Tạo ${date} thành công`, 'success'))
      .catch((error: any) => showSnackbar(error, 'error'))
  }
}

export interface UpdateRollCallDateProps extends AddRollCallDateProps {
  id: string
  date: string
  classId: string
  year?: string
  semester?: string
}

export const useUpdateRollCallDate = () => {
  const { showSnackbar } = useSnackbarContext()
  return ({ date, id, classId, year = '2022-2023', semester = 'hk1' }: UpdateRollCallDateProps) => {
    return set(ref(realtimeDB, rollCallPathNameWithId(classId, year, id, semester)), date)
      .then(() => showSnackbar(`Thay đổi ${date} thành công`, 'success'))
      .catch((error: any) => showSnackbar(error, 'error'))
  }
}

interface GetRollCallDateProps {
  classId: string
  year?: string
  semester?: string
}

export const fetchRollCallDates = ({
  classId,
  year = '2022-2023',
  semester = 'hk1',
}: GetRollCallDateProps) => {
  return get(ref(realtimeDB, rollCallPathName(classId, year, semester)))
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

interface SubmitAttendanceAllStudentsInClass {
  studentIds: string[]
  classId: string
  rollDateId: string
  attendance: boolean
  year?: string
  semester?: string
}

export const submitAttendanceAllStudentsInClass = ({
  studentIds,
  classId,
  rollDateId,
  attendance,
  semester = 'hk1',
  year = '2022-2023',
}: SubmitAttendanceAllStudentsInClass) => {
  const updatedObj = studentIds.reduce((acc, studentId) => {
    return {
      ...acc,
      [`${attendancePathName(classId, year, semester)}/${studentId}/${rollDateId}`]: {
        tl: attendance,
        gl: attendance,
      },
    }
  }, {})

  return update(ref(realtimeDB), updatedObj)
    .then(() => console.info(`Điểm danh thành công`, 'success'))
    .catch((error: any) => console.error(error, 'error'))
}

interface UpdateNoteAttendance {
  studentId: string
  classId: string
  rollDateId: string
  note: string
  year?: string
  semester?: string
}

export const updateNoteAttendance = ({
  studentId,
  classId,
  rollDateId,
  note,
  semester = 'hk1',
  year = '2022-2023',
}: UpdateNoteAttendance) => {
  return set(
    ref(
      realtimeDB,
      `${attendancePathName(classId, year, semester)}/${studentId}/${rollDateId}/note`
    ),
    note
  )
}

interface SubmitAttendanceProps {
  studentId: string
  classId: string
  rollDateId: string
  attendance: boolean
  isMissal: boolean
  year?: string
  semester?: string
}

export const useSubmitAttendance = () => {
  const { showSnackbar } = useSnackbarContext()

  return ({
    studentId,
    classId,
    rollDateId,
    attendance,
    isMissal,
    semester = 'hk1',
    year = '2022-2023',
  }: SubmitAttendanceProps) => {
    return set(
      ref(
        realtimeDB,
        `${attendancePathName(classId, year, semester)}/${studentId}/${rollDateId}/${
          isMissal ? AttendanceType.THANH_LE : AttendanceType.GIAO_LY
        }`
      ),
      attendance
    )
      .then(() => showSnackbar(`Điểm danh thành công`, 'success'))
      .catch((error: any) => showSnackbar(error, 'error'))
  }
}

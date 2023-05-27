import { realtimeDB } from '../firebase'
import { onValue, ref, set, get, Unsubscribe } from 'firebase/database'
import { useState, useEffect } from 'react'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useClassContext } from 'contexts/ClassContext'
import { v4 as uuidv4 } from 'uuid'
import { AttendanceType } from 'constant/common'
import { AttendanceProps } from 'modules/common/AttendanceCheckbox.component'

const attendancePathName = (classId: string, year: string) => `attendance/${classId}/${year}`
const rollCallPathNameWithId = (classId: string, year: string, id: string) =>
  `rollCall/${classId}/${year}/${id}`
const rollCallPathName = (classId: string, year: string) => `rollCall/${classId}/${year}`

export const useGetAttendanceByClassId = (
  classId: string,
  year: string | undefined = '2022-2023'
) => {
  const [attendances, setAttendances] = useState<Record<
    string,
    Record<string, AttendanceProps>
  > | null>()
  const [listener, setListener] = useState<Unsubscribe>()
  useEffect(() => {
    if (classId) {
      const subscribe = onValue(ref(realtimeDB, attendancePathName(classId, year)), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          setAttendances(data)
          return
        }
        setAttendances(null)
      })
      setListener(() => subscribe)
      return subscribe
    }
  }, [classId, year])

  useEffect(() => {
    if (listener) {
      listener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  return { attendances, isLoading: typeof attendances === 'undefined' }
}

export interface AddRollCallDateProps {
  date: string
}

export const useAddRollCallDate = () => {
  const { showSnackbar } = useSnackbarContext()
  const { classId } = useClassContext()
  const year = '2022-2023'
  return ({ date }: AddRollCallDateProps) => {
    return set(ref(realtimeDB, rollCallPathNameWithId(classId, year, uuidv4())), date)
      .then(() => showSnackbar(`${date} has been added`, 'success'))
      .catch((error: any) => showSnackbar(error, 'error'))
  }
}

export interface UpdateRollCallDateProps extends AddRollCallDateProps {
  id: string
}

export const useUpdateRollCallDate = () => {
  const { showSnackbar } = useSnackbarContext()
  const { classId } = useClassContext()
  const year = '2022-2023'
  return ({ date, id }: UpdateRollCallDateProps) => {
    return set(ref(realtimeDB, rollCallPathNameWithId(classId, year, id)), date)
      .then(() => showSnackbar(`${date} has been added`, 'success'))
      .catch((error: any) => showSnackbar(error, 'error'))
  }
}

export const useGetRollCallDates = () => {
  const { showSnackbar } = useSnackbarContext()
  const year = '2022-2023'
  return (classId: string) => {
    console.log({ currentClassId: classId })
    return get(ref(realtimeDB, rollCallPathName(classId, year)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          showSnackbar('Roll call dates has been fetch', 'success')
          return snapshot.val()
        } else {
          showSnackbar('No data available', 'warning')
          return null
        }
      })
      .catch((error) => {
        showSnackbar(error, 'error')
      })
  }
}

interface SubmitAttendanceProps {
  studentId: string
  classId: string
  rollDateId: string
  attendance: boolean
  isMissal: boolean
}

export const useSubmitAttendance = () => {
  const { showSnackbar } = useSnackbarContext()

  return ({ studentId, classId, rollDateId, attendance, isMissal }: SubmitAttendanceProps) => {
    console.log({ studentId, classId, rollDateId, attendance, isMissal })
    return set(
      ref(
        realtimeDB,
        `${attendancePathName(classId, '2022-2023')}/${studentId}/${rollDateId}/${
          isMissal ? AttendanceType.THANH_LE : AttendanceType.GIAO_LY
        }`
      ),
      attendance
    )
      .then(() => showSnackbar(`Attendance ${studentId} Updated`, 'success'))
      .catch((error: any) => showSnackbar(error, 'error'))
  }
}

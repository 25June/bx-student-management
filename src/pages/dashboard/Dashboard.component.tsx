import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import ReportContainer from './ReportContainer'
import HolyGrailIcon from 'modules/common/HolyGrailIcon'
import HolyBibleIcon from 'modules/common/HolyBibleIcon'
import { useIsMobile } from 'utils/common'
import { useClassContext } from 'contexts/ClassContext'
import { getAllStudents } from 'services/student'
import { startOfWeek } from 'date-fns'
import {
  Attendances,
  fetchRollCallDatesOfAllClass,
  getAttendanceByClassId,
} from 'services/diligent'
import { formatDisplayInput } from 'utils/datetime'
import { Class } from 'models'
import { get } from 'lodash'

const DashboardComponent = () => {
  const isMobile = useIsMobile()
  const { semesterId, schoolYearId } = useClassContext()
  const [total, setTotal] = useState<number>(0)
  const [GL, setGL] = useState<number>(0)
  const [TL, setTL] = useState<number>(0)
  const [date, setDate] = useState<string>('')

  const countStudentPresentPerDate = (
    dateAsString: string,
    dateId: string,
    attendance: Attendances,
    totalLength: string[],
    c: Class
  ): any => {
    const defaultValue = {
      tl: 0,
      gl: 0,
      note: 0,
    }
    if (attendance) {
      const statistic = totalLength.reduce((acc, id) => {
        const data = get(attendance, [id, dateId], null)
        if (data) {
          return {
            tl: data.tl ? acc.tl + 1 : acc.tl,
            gl: data.gl ? acc.gl + 1 : acc.gl,
            note: data.note ? acc.note + 1 : acc.note,
          }
        }
        return acc
      }, defaultValue)
      return { ...statistic, dateAsString, total: totalLength, c }
    }
    return { ...defaultValue, dateAsString, total: totalLength, c }
  }
  const getRollCallDateIdWithClass = ({
    date,
    rollCallDate,
  }: {
    date: string
    rollCallDate: { c: Class; value: Record<string, string> }
  }) => {
    const target = Object.keys(rollCallDate.value ?? {}).find(
      (key: string) => rollCallDate.value[key] === date
    )
    if (target) {
      getAttendanceByClassId({
        classId: rollCallDate.c.id,
        semesterId,
        schoolYearId,
        rollCallDateId: rollCallDate.value[target],
      }).then((res: Attendances) => {
        const value = countStudentPresentPerDate(
          rollCallDate.value[target],
          target,
          res,
          Object.keys(res),
          rollCallDate.c
        )
        setTimeout(() => {
          setGL((prev) => prev + value.gl ?? 0)
          setTL((prev) => prev + value.tl ?? 0)
        }, 1000)
      })
    }
  }

  useEffect(() => {
    getAllStudents().then((res) => setTotal(res))
    const lastSunday = startOfWeek(new Date())
    setDate(lastSunday.toLocaleDateString('en-AU'))
    fetchRollCallDatesOfAllClass({ semesterId, schoolYearId }).then((arr) => {
      arr.forEach((res: { c: Class; value: Record<string, string> }) => {
        const formatDate = formatDisplayInput(lastSunday)
        getRollCallDateIdWithClass({ date: formatDate, rollCallDate: res })
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterId, schoolYearId])

  const gl = {
    title: 'Giáo Lý',
    date: date,
    value: GL,
    total: total,
    subtitle: 'Em tham dự',
    icon: <HolyBibleIcon color={'inherit'} styles={{ width: 64, height: 64 }} />,
  }
  const tl = {
    title: 'Thánh Lễ',
    date: date,
    value: TL,
    total: total,
    subtitle: 'Em tham dự',
    icon: <HolyGrailIcon color={'inherit'} styles={{ width: 64, height: 64 }} />,
  }
  return (
    <Box>
      <Typography variant={'h1'} sx={{ textAlign: 'left', fontSize: '1rem', marginBottom: '1rem' }}>
        Tổng quan
      </Typography>
      <Box sx={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
        <ReportContainer {...gl} />
        <ReportContainer {...tl} />
      </Box>
    </Box>
  )
}

export default DashboardComponent

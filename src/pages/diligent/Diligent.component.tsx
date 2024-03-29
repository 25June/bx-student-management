import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, SelectChangeEvent } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { submitAttendanceAllStudentsInClass } from 'services/diligent'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useDialogContext } from 'contexts/DialogContext'
import { useDiligentContext } from 'contexts/DiligentContext'
import { countStudentPresent } from 'utils/diligentSummary'
import { useIsMobile } from 'utils/common'
import { groupRollCallToSortedMonths } from 'utils/customHooks'
import { RollCallDate } from 'models/diligent'
import { Student } from 'models/student'
import { KeyValueProp } from 'models/common'
import DiligentTableComponent from 'modules/diligent-table/DiligentTable.component'
import SearchComponent from 'modules/common/Search.component'
import DiligentSkeletonComponent from 'modules/diligent/DiligentSkeleton.component'
import OverviewReportComponent from 'modules/report/Overview.component'
import { colors } from '@mui/material'
import { PillProgress } from 'modules/progress-bar/LinearProgressWithLabel.component'

const DiligentComponent = () => {
  const { rollCallDates, fetchRollCallDates, attendances } = useDiligentContext()
  const { students, studentByKeywords } = useStudentContext()
  const { classId, semesterId, schoolYearId, disableUpdate } = useClassContext()
  const isMobile = useIsMobile()
  const { openDialog } = useDialogContext()
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<RollCallDate>()

  const [groupRollDate, setGroupRollDate] = useState<Record<string, RollCallDate[]>>({})
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [studentAttendanceCount, setStudentAttendanceCount] = useState<{ tl: number; gl: number }>()
  useEffect(() => {
    if (students) {
      setFilteredStudents(students)
    }
  }, [students])

  const getRollCallDates = () => {
    if (!!fetchRollCallDates && classId && semesterId && schoolYearId) {
      fetchRollCallDates({ classId, semesterId, schoolYearId }).then(
        (res: Record<string, string> | null) => {
          if (res) {
            const sortedMonthDate = groupRollCallToSortedMonths(res)
            setGroupRollDate(sortedMonthDate)
            return
          }
          setGroupRollDate({})
          setSelectedMonth('')
        }
      )
    }
  }

  useEffect(() => {
    if (classId) {
      getRollCallDates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  useEffect(() => {
    if (selectedDate && attendances && students) {
      setStudentAttendanceCount(countStudentPresent(selectedDate.key, attendances, students))
    }
  }, [selectedDate, attendances, students])

  useEffect(() => {
    if (rollCallDates) {
      const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)
      setGroupRollDate(sortedMonthDate)
    }
  }, [rollCallDates])

  const handleChangeMonth = (event: SelectChangeEvent | string) => {
    if (typeof event === 'string') {
      setSelectedMonth(event)
    } else {
      setSelectedMonth(event.target.value)
    }
    setSelectedDate(undefined)
  }

  const handleChangeDate = (updatedDate?: KeyValueProp, month?: string) => {
    if (updatedDate && updatedDate.value === 'all') {
      setSelectedDate(undefined)
      return
    }

    if (month) {
      const rollCallDate = groupRollDate[month].find(
        (date) => date.dateAsString === updatedDate?.value
      )
      setSelectedDate(rollCallDate)
      return
    }

    const rollCallDate = groupRollDate[selectedMonth].find(
      (date) => date.dateAsString === updatedDate?.value
    )
    setSelectedDate(rollCallDate)
  }

  const handleOpenDiligentDialog = (date: string, id: string) => {
    const callback = (refreshData?: boolean) => {
      if (refreshData) {
        setSelectedDate(undefined)
        getRollCallDates()
      }
    }

    openDialog(
      DialogType.STUDY_DATE_DIALOG,
      RollCallDateActionType.EDIT_STUDY_DATE,
      {
        date,
        id,
      },
      callback
    )
  }

  const formatAttendances = filteredStudents.map((stu: Student) => {
    return {
      ...stu,
      rollCalls: rollCallDates,
    }
  })

  const handleFilterStudentByName = (value: string) => {
    if (students && students.length !== 0) {
      if (!value) {
        setFilteredStudents(students)
        return
      }

      const filtered = students.filter((stu) => {
        return studentByKeywords[stu.id].includes(value.toLowerCase())
      })
      setFilteredStudents(filtered)
    }
  }

  const handleMarkAllStudentPresent = () => {
    if (disableUpdate) {
      return
    }
    if (selectedDate?.key && students?.length !== 0 && classId) {
      const confirmation = window.confirm(
        'Xác nhận điểm danh tất cả thiếu nhi có tham dự Giáo Lý và Thánh Lễ!'
      )
      if (confirmation) {
        return submitAttendanceAllStudentsInClass({
          studentIds: students.map((stu) => stu.id),
          classId,
          rollDateId: selectedDate.key,
          attendance: true,
          semesterId,
          schoolYearId,
        })
      }
    }
  }

  const handleSelectDate = (date: KeyValueProp, month: string) => {
    handleChangeMonth(month)
    handleChangeDate(date, month)
  }
  const showSubmitAllButton =
    selectedDate?.key &&
    (studentAttendanceCount?.tl !== students?.length ||
      studentAttendanceCount?.gl !== students?.length)

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {selectedMonth && selectedDate && (
          <IconButton
            onClick={() => {
              setSelectedDate(undefined)
              setSelectedMonth('')
            }}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>
        )}
        <Typography variant={'h1'} sx={{ textAlign: 'left', fontSize: '1rem', marginBottom: 0 }}>
          Chuyên Cần{' '}
          {selectedDate && new Date(selectedDate.dateAsString).toLocaleDateString('en-AU')}
        </Typography>
      </Box>
      {!selectedDate && !selectedMonth ? (
        <Box
          sx={{ flexGrow: 1, height: '100%', width: '100%', overflowY: 'auto', paddingBottom: 7 }}
        >
          <OverviewReportComponent
            onViewDetail={handleSelectDate}
            openDiligentDialog={handleOpenDiligentDialog}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 1,
              marginTop: 1,
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              width: '100%',
            }}
          >
            <SearchComponent onChange={handleFilterStudentByName} />
          </Box>
          {showSubmitAllButton && (
            <Box
              sx={{
                padding: '0.5rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                <PillProgress
                  label={`TL: ${studentAttendanceCount?.tl}`}
                  value={studentAttendanceCount?.tl ?? 0}
                  total={students?.length ?? 0}
                />
                <PillProgress
                  label={`GL: ${studentAttendanceCount?.gl}`}
                  value={studentAttendanceCount?.gl ?? 0}
                  total={students?.length ?? 0}
                />
              </Box>
              <IconButton
                sx={{ border: `1px solid ${colors.blue[600]}`, borderRadius: '5px' }}
                color="primary"
                onClick={handleMarkAllStudentPresent}
                disabled={disableUpdate}
              >
                <DoneAllIcon />
              </IconButton>
            </Box>
          )}
          <Box mt={2} mb={2} sx={{ flexGrow: 1, height: '100%', width: '100%', overflowY: 'auto' }}>
            {!formatAttendances || formatAttendances.length === 0 ? (
              <DiligentSkeletonComponent />
            ) : (
              <DiligentTableComponent
                rows={formatAttendances}
                rollCallDates={groupRollDate[selectedMonth || Object.keys(groupRollDate)[0]]}
                openDiligentDialog={handleOpenDiligentDialog}
                selectedRollCallDate={selectedDate}
                attendances={attendances || {}}
              />
            )}
          </Box>
        </>
      )}
    </>
  )
}

export default DiligentComponent

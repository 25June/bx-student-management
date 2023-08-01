import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, IconButton, Button } from '@mui/material'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { KeyValueProp, Student } from 'models'
import DiligentTableComponent from 'modules/diligent-table/DiligentTable.component'
import MonthDropdownComponent from 'modules/common/MonthDropdown.component'
import { groupRollCallToSortedMonths, RollCallDate } from 'utils/customHooks'
import { SelectChangeEvent } from '@mui/material/Select'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { useDialogContext } from 'contexts/DialogContext'
import DateDropdownComponent from 'modules/common/DateDropdown.component'
import DiligentSkeletonComponent from 'modules/diligent/DiligentSkeleton.component'
import { useDiligentContext } from 'contexts/DiligentContext'
import EditIcon from '@mui/icons-material/Edit'
import { countStudentPresent } from 'utils/diligentSummary'
import AttendanceCountComponent from 'modules/diligent/AttendanceCountComponent'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { submitAttendanceAllStudentsInClass } from 'services/diligent'

const DiligentComponent = () => {
  const { rollCallDates, fetchRollCallDates, attendances } = useDiligentContext()
  const { students } = useStudentContext()
  const { classId, semesterId, schoolYearId } = useClassContext()
  const isMobile = useIsMobile()
  const { openDialog } = useDialogContext()
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedRollCallDate, setSelectedRollCallDate] = useState<RollCallDate>()

  const [groupRollDate, setGroupRollDate] = useState<Record<string, RollCallDate[]>>({})
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [studentAttendanceCount, setStudentAttendanceCount] = useState<{ tl: number; gl: number }>()
  useEffect(() => {
    if (students) {
      Promise.resolve().then(() => {
        setFilteredStudents(students)
      })
    }
  }, [students])

  const getRollCallDates = useCallback(() => {
    if (fetchRollCallDates !== null) {
      fetchRollCallDates({ classId, semesterId, schoolYearId }).then(
        (res: Record<string, string> | null) => {
          if (res) {
            const sortedMonthDate = groupRollCallToSortedMonths(res)
            setGroupRollDate(sortedMonthDate)
            setSelectedMonth(Object.keys(sortedMonthDate)[0])
            return
          }
          setGroupRollDate({})
          setSelectedMonth('')
        }
      )
    }
  }, [classId, fetchRollCallDates, semesterId, schoolYearId])

  useEffect(() => {
    if (classId) {
      getRollCallDates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, getRollCallDates])

  useEffect(() => {
    if (selectedRollCallDate && attendances) {
      Promise.resolve().then(() => {
        setStudentAttendanceCount(countStudentPresent(selectedRollCallDate.key, attendances))
      })
    }
  }, [selectedRollCallDate, attendances])

  useEffect(() => {
    if (rollCallDates) {
      Promise.resolve().then(() => {
        const sortedMonthDate = groupRollCallToSortedMonths(rollCallDates)
        setGroupRollDate(sortedMonthDate)
        setSelectedMonth(Object.keys(sortedMonthDate)[0])
      })
    }
  }, [rollCallDates])

  const handleChangeMonth = (event: SelectChangeEvent | string) => {
    if (typeof event === 'string') {
      setSelectedMonth(event)
    } else {
      setSelectedMonth(event.target.value)
    }
    setSelectedRollCallDate(undefined)
  }

  const handleChangeDate = (updatedDate?: KeyValueProp) => {
    if (updatedDate && updatedDate.value === 'all') {
      Promise.resolve().then(() => {
        setSelectedRollCallDate(undefined)
      })
      return
    }

    Promise.resolve().then(() => {
      const rollCallDate = groupRollDate[selectedMonth].find(
        (date) => date.dateAsString === updatedDate?.value
      )
      setSelectedRollCallDate(rollCallDate)
    })
  }

  const handleOpenDiligentDialog = (date: string, id: string) => {
    const callback = (refreshData?: boolean) => {
      if (refreshData) {
        setSelectedRollCallDate(undefined)
        getRollCallDates()
      }
    }

    const rollCall = {
      date,
      id,
    }
    openDialog(
      DialogType.STUDY_DATE_DIALOG,
      RollCallDateActionType.EDIT_STUDY_DATE,
      rollCall,
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
        const keywordArr = [...stu.lastName.split(' '), ...stu.firstName.split(' ')].map(
          (keyword) => toLowerCaseNonAccentVietnamese(keyword)
        )
        return keywordArr.includes(value.toLowerCase())
      })
      setFilteredStudents(filtered)
    }
  }

  const handleMarkAllStudentPresent = () => {
    if (selectedRollCallDate?.key && students?.length !== 0 && classId) {
      const confirmation = window.confirm('Chắc chưa?')
      if (confirmation) {
        return submitAttendanceAllStudentsInClass({
          studentIds: students.map((stu) => stu.id),
          classId,
          rollDateId: selectedRollCallDate.key,
          attendance: true,
          semesterId,
          schoolYearId,
        })
      }
    }
  }

  const showSubmitAllButton =
    selectedRollCallDate?.key &&
    (studentAttendanceCount?.tl !== students?.length ||
      studentAttendanceCount?.gl !== students?.length)

  return (
    <Box>
      <Box p={isMobile ? 1 : 2}>
        <Box
          sx={{
            display: 'flex',
            gap: isMobile ? 1 : 2,
            width: '100%',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Typography
            variant={'h1'}
            sx={{ textAlign: 'left', fontSize: isMobile ? '1rem' : '2rem' }}
          >
            Điểm Chuyên Cần{' '}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: isMobile ? 2 : 4,
            marginTop: 1,
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
            {rollCallDates && selectedMonth && (
              <MonthDropdownComponent
                selectedMonth={selectedMonth}
                dates={Object.keys(groupRollDate)}
                onChangeMonth={handleChangeMonth}
              />
            )}
            {groupRollDate && selectedMonth && (
              <>
                <DateDropdownComponent
                  selectedDate={selectedRollCallDate?.dateAsString}
                  dates={groupRollDate[selectedMonth].map((date) => ({
                    key: date.key,
                    value: date.dateAsString,
                  }))}
                  onChangeDate={handleChangeDate}
                />
                {isMobile && selectedRollCallDate && (
                  <IconButton
                    color="default"
                    size="small"
                    onClick={() =>
                      handleOpenDiligentDialog(
                        selectedRollCallDate.dateAsString,
                        selectedRollCallDate.key
                      )
                    }
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </>
            )}
          </Box>
          {formatAttendances && formatAttendances.length !== 0 && (
            <SearchComponent onChange={handleFilterStudentByName} />
          )}
        </Box>
        {studentAttendanceCount && (
          <AttendanceCountComponent
            studentAttendanceCount={studentAttendanceCount}
            totalStudents={students?.length || 0}
          />
        )}
        {showSubmitAllButton && (
          <Box sx={{ padding: '0.5rem 0' }}>
            <Button
              variant={'outlined'}
              onClick={handleMarkAllStudentPresent}
              endIcon={<DoneAllIcon />}
            >
              Đánh dấu tất cả đều có mặt
            </Button>
          </Box>
        )}
        <Box mt={2} mb={2}>
          {!formatAttendances || formatAttendances.length === 0 ? (
            <DiligentSkeletonComponent />
          ) : (
            <DiligentTableComponent
              rows={formatAttendances || []}
              rollCallDates={groupRollDate[selectedMonth || Object.keys(groupRollDate)[0]]}
              openDiligentDialog={handleOpenDiligentDialog}
              selectedRollCallDate={selectedRollCallDate}
              attendances={attendances || {}}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default DiligentComponent

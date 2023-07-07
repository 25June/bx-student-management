import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useGetAttendanceByClassId, useGetRollCallDates } from 'services/diligent'
import { KeyValueProp, Student } from 'models'
import DiligentTableComponent from 'modules/diligent-table/DiligentTable.component'
import MonthDropdownComponent from 'modules/common/MonthDropdown.component'
import { groupRollCallToSortedMonths, RollCallDate } from 'utils/customHooks'
import { SelectChangeEvent } from '@mui/material/Select'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { useDialogContext } from 'contexts/DialogContext'
import DateDropdownComponent from 'modules/common/DateDropdown.component'
import DiligentSkeletonComponent from 'modules/diligent/DiligentSkeleton.component'

const DiligentComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const getRollCallDates = useGetRollCallDates()
  const isMobile = useIsMobile()
  const { openDialog } = useDialogContext()
  const { attendances } = useGetAttendanceByClassId({ classId })

  const [rollCallDates, setRollCallDates] = useState<Record<string, string>>({})
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedRollCallDate, setSelectedRollCallDate] = useState<RollCallDate>()

  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')
  const [groupRollDate, setGroupRollDate] = useState<Record<string, RollCallDate[]>>({})

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  useEffect(() => {
    if (students) {
      setFilteredStudents(students)
    }
  }, [students])

  const fetchRollCallDates = useCallback(() => {
    getRollCallDates({ classId }).then((res: Record<string, string>) => {
      setRollCallDates(res)
      const sortedMonthDate = groupRollCallToSortedMonths(res)
      setGroupRollDate(sortedMonthDate)
      setSelectedMonth(Object.keys(sortedMonthDate)[0])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  useEffect(() => {
    if (classId) {
      fetchRollCallDates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

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
      setSelectedRollCallDate(undefined)
      return
    }

    const rollCallDate = groupRollDate[selectedMonth].find(
      (date) => date.dateAsString === updatedDate?.value
    )
    setSelectedRollCallDate(rollCallDate)
  }

  const handleOpenDiligentDialog = (date: string, id: string) => {
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

  const callback = (refreshData?: boolean) => {
    if (refreshData) {
      fetchRollCallDates()
    }
  }

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value)
  }

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
  console.log({ formatAttendances })

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
          <SemesterDropdownComponent
            selectedSemester={selectedSemester}
            onChangeSemester={handleChangeSemester}
            size={'small'}
          />
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
          <Box>
            <SearchComponent onChange={handleFilterStudentByName} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
            {rollCallDates && selectedMonth && (
              <MonthDropdownComponent
                selectedMonth={selectedMonth}
                dates={Object.keys(groupRollDate)}
                onChangeMonth={handleChangeMonth}
              />
            )}
            {groupRollDate && selectedMonth && (
              <DateDropdownComponent
                selectedDate={selectedRollCallDate?.dateAsString}
                dates={groupRollDate[selectedMonth].map((date) => ({
                  key: date.key,
                  value: date.dateAsString,
                }))}
                onChangeDate={handleChangeDate}
              />
            )}
          </Box>
        </Box>
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

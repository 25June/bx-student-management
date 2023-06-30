import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { DialogType, RollCallDateActionType } from 'constant/common'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useGetRollCallDates } from 'services/diligent'
import { Student } from 'models'
import { formatDisplayInput } from 'utils/datetime'
import DiligentTableComponent from 'modules/diligent-table/DiligentTable.component'
import MonthDropdownComponent from 'modules/common/MonthDropdown.component'
import { RollCallDates, useGroupRollCallToSortedMonths } from 'utils/customHooks'
import { SelectChangeEvent } from '@mui/material/Select'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import { useDialogContext } from 'contexts/DialogContext'

const DiligentComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const getRollCallDates = useGetRollCallDates()
  const isMobile = useIsMobile()
  const { openDialog } = useDialogContext()
  const [rollCallDates, setRollCallDates] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('hk1')

  const groupRollDate = useGroupRollCallToSortedMonths(rollCallDates) as Record<
    string,
    RollCallDates[]
  >

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  useEffect(() => {
    if (students) {
      setFilteredStudents(students)
    }
  }, [students])

  const fetchRollCallDates = useCallback(() => {
    getRollCallDates({ classId }).then((res: Record<string, string>) => {
      setRollCallDates(res)
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
      setSelectedDate(event)
    } else {
      setSelectedDate(event.target.value)
    }
  }

  const handleOpenDiligentDialog = (date: string, id: string) => {
    const rollCall = {
      date: formatDisplayInput(date),
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
          }}
        >
          <Box>
            <SearchComponent onChange={handleFilterStudentByName} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {rollCallDates && (
              <MonthDropdownComponent
                selectedDate={selectedDate || Object.keys(groupRollDate)[0] || ''}
                dates={Object.keys(groupRollDate)}
                onChangeMonth={handleChangeMonth}
              />
            )}
          </Box>
        </Box>
        <Box mt={2} mb={2}>
          <DiligentTableComponent
            rows={formatAttendances || []}
            rollCallDates={groupRollDate[selectedDate || Object.keys(groupRollDate)[0]]}
            openDiligentDialog={handleOpenDiligentDialog}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default DiligentComponent

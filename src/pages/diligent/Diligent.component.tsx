import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { RollCallDateActionType } from 'constant/common'
import DiligentDialogComponent from 'modules/diligent-dialog/DiligentDialog.component'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useGetRollCallDates } from 'services/diligent'
import { Student } from 'models'
import { formatDisplayInput } from 'utils/datetime'
import DiligentTableComponent from 'modules/diligent-table/DiligentTable.component'
import EventIcon from '@mui/icons-material/Event'
import MonthDropdownComponent from 'modules/common/MonthDropdown.component'
import { useGroupRollCallToSortedMonths, RollCallDates } from 'utils/customHooks'
import { SelectChangeEvent } from '@mui/material/Select'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import SearchComponent from 'modules/common/Search.component'
import { toLowerCaseNonAccentVietnamese, useIsMobile } from 'utils/common'
import SpeedDialComponent from 'modules/speed-dial/SpeedDial.component'

const DiligentComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const getRollCallDates = useGetRollCallDates()
  const isMobile = useIsMobile()
  const [rollCallDates, setRollCallDates] = useState<Record<string, string>>({})
  const [isOpen, openDiligentDialog] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState<Record<string, any>>({
    action: RollCallDateActionType.ADD_STUDY_DATE,
  })
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
    setDialogData({
      rollCall: {
        date: formatDisplayInput(date),
        id,
      },
      action: RollCallDateActionType.EDIT_STUDY_DATE,
    })
    openDiligentDialog(true)
  }

  const formatAttendances = filteredStudents.map((stu: Student) => {
    return {
      ...stu,
      rollCalls: rollCallDates,
    }
  })

  const handleCloseDiligentDialog = (refreshData?: boolean) => {
    if (refreshData) {
      fetchRollCallDates()
    }
    openDiligentDialog(false)
    setDialogData({
      action: RollCallDateActionType.ADD_STUDY_DATE,
    })
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
      <SpeedDialComponent />
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
            <Button
              variant="contained"
              startIcon={<EventIcon />}
              onClick={() => openDiligentDialog(true)}
              sx={{ minWidth: '172px' }}
            >
              Thêm Ngày Học
            </Button>
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
      <DiligentDialogComponent
        isOpen={isOpen}
        onClose={handleCloseDiligentDialog}
        action={dialogData.action}
        rollCall={dialogData.rollCall}
      />
    </Box>
  )
}

export default DiligentComponent

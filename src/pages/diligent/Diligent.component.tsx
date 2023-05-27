import React, { useState, useEffect, useCallback } from 'react'
import LayoutComponent from 'modules/layout/Layout.component'
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

const DiligentComponent = () => {
  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const getRollCallDates = useGetRollCallDates()

  const [rollCallDates, setRollCallDates] = useState<Record<string, string>>({})
  const [isOpen, openDiligentDialog] = useState<boolean>(false)
  const [dialogData, setDialogData] = useState<Record<string, any>>({
    action: RollCallDateActionType.ADD_STUDY_DATE,
  })

  const fetchRollCallDates = useCallback(() => {
    getRollCallDates(classId).then((res: Record<string, string>) => {
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

  const formatAttendances = students.map((stu: Student) => {
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
  return (
    <LayoutComponent>
      <Box p={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            marginTop: 2,
          }}
        >
          <Typography variant={'h1'}>Điểm Chuyên Cần</Typography>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            onClick={() => openDiligentDialog(true)}
            sx={{ marginRight: 2 }}
          >
            Thêm Ngày Học
          </Button>
        </Box>
        <Box mt={2} mb={2}>
          <DiligentTableComponent
            rows={formatAttendances || []}
            rollCalls={rollCallDates}
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
    </LayoutComponent>
  )
}

export default DiligentComponent

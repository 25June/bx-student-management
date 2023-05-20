import React, { useState, useEffect, useCallback } from 'react'
import LayoutComponent from 'modules/layout/Layout.component'
import { Box, Button } from '@mui/material'
import { useIsMobile } from 'utils/common'
import { RollCallDateActionType } from 'constant/common'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DiligentDialogComponent from 'modules/diligent-dialog/DiligentDialog.component'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useGetAttendanceByClassId, useGetRollCallDates } from 'services/diligent'
import { renderAttendanceActions, attendanceColumns, renderDate } from 'modules/Table/helpers'
import TableComponent from 'modules/Table/Table.component'
import { Student } from 'models'
import { formatDisplayInput } from 'utils/datetime'

const DiligentComponent = () => {
  const mobile = useIsMobile()

  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const { attendances, isLoading } = useGetAttendanceByClassId(classId)
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

  if (isLoading) {
    return null
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
  console.log({ attendances })
  console.log({ rollCallDates })
  const formatAttendances = students.map((stu: Student) => ({ ...stu, rollCallDates }))
  const formatHeaderAttendance = {
    field: 'rollCallDates',
    headerName: renderDate(rollCallDates, true, handleOpenDiligentDialog),
    render: () => renderDate({}, false),
    disableSort: true,
  }

  const handleClickAction = (data: any, type: string) => {
    setDialogData({ rollCallDate: data, action: type })
  }

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
      <Box>
        <Box component={mobile ? 'h3' : 'h2'} marginBottom={2}>
          Điểm Chuyên Cần
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => openDiligentDialog(true)}
          sx={{ marginRight: 2 }}
        >
          Điểm Danh Ngày Học
        </Button>
        <TableComponent
          columns={[...attendanceColumns, formatHeaderAttendance]}
          rows={formatAttendances || []}
          onClickAction={handleClickAction}
          renderActionMenu={renderAttendanceActions}
        />
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

import React, { useState } from 'react'
import LayoutComponent from 'modules/layout/Layout.component'
import { Box, Button } from '@mui/material'
import { useIsMobile } from 'utils/common'
import { DiligentActionType } from 'constant/common'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DiligentDialogComponent from 'modules/diligent-dialog/DiligentDialog.component'
import { useClassContext } from 'contexts/ClassContext'
import { useStudentContext } from 'contexts/StudentContext'
import { useGetAttendanceByClassId } from 'services/diligent'

const DiligentComponent = () => {
  const mobile = useIsMobile()

  const { students } = useStudentContext()
  const { classId } = useClassContext()
  const { attendances, isLoading } = useGetAttendanceByClassId(classId)

  const [isOpen, openDiligentDialog] = useState<boolean>(false)
  if (isLoading) {
    return null
  }

  console.log(attendances)

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
      </Box>
      <DiligentDialogComponent
        isOpen={isOpen}
        onClose={() => openDiligentDialog(false)}
        action={DiligentActionType.ADD_STUDY_DATE}
      />
    </LayoutComponent>
  )
}

export default DiligentComponent

import React, { useCallback, useState } from 'react'
import { LayoutComponent } from 'modules'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { AssessmentDialogComponent, AssessmentTableComponent } from 'modules/index'
import { Assessment } from 'models/assessment'
import { AssessmentActionType } from 'constant'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useIsMobile } from 'utils/common'

const AssessmentComponent = () => {
  const mobile = useIsMobile()
  const { assessments } = useAssessmentContext()

  const [actionType, setActionType] = useState<string>('')
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)

  const closeStudentDialog = useCallback((): void => {
    setActionType('')
    setSelectedAssessment(null)
  }, [])

  const openStudentDialog = useCallback(
    (assessment: Assessment | null, type: AssessmentActionType): void => {
      switch (type) {
        case AssessmentActionType.ADD_NEW_ASSESSMENT:
          setActionType(type)
          break
        case AssessmentActionType.EDIT_ASSESSMENT:
        case AssessmentActionType.DELETE_ASSESSMENT:
          setSelectedAssessment(assessment)
          setActionType(type)
          break
      }
    },
    []
  )

  return (
    <LayoutComponent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: mobile ? 'column' : 'row',
        }}
      >
        <Box component={mobile ? 'h3' : 'h1'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Danh Sách Bài Kiểm Tra
        </Box>
        <Box display={'flex'} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => openStudentDialog(null, AssessmentActionType.ADD_NEW_ASSESSMENT)}
            sx={{ marginRight: 2 }}
          >
            Thêm Bài Kiểm Tra
          </Button>
        </Box>
      </Box>
      <Box p={2}>
        {assessments && (
          <AssessmentTableComponent rows={assessments} onClickAction={openStudentDialog} />
        )}
      </Box>
      {actionType !== '' && (
        <AssessmentDialogComponent
          key={selectedAssessment?.id || 'new'}
          isOpen={actionType !== ''}
          onClose={() => closeStudentDialog()}
          action={actionType}
          data={selectedAssessment}
        />
      )}
    </LayoutComponent>
  )
}

export default AssessmentComponent

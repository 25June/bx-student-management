import React, { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, Typography } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { AssessmentDialogComponent, AssessmentTableComponent } from 'modules/index'
import { Assessment } from 'models/assessment'
import { AssessmentActionType } from 'constant'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useIsMobile } from 'utils/common'

const AssessmentComponent = () => {
  const { assessments } = useAssessmentContext()
  const isMobile = useIsMobile()

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
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: isMobile ? 1 : 2,
          padding: isMobile ? 1 : 2,
          width: '100%',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant={'h1'} sx={{ fontSize: isMobile ? '1rem' : '2rem' }}>
          Bài Kiểm Tra
        </Typography>
        <Button
          variant="contained"
          startIcon={<AssignmentIcon />}
          onClick={() => openStudentDialog(null, AssessmentActionType.ADD_NEW_ASSESSMENT)}
        >
          Thêm Bài Kiểm Tra
        </Button>
      </Box>
      <Box p={isMobile ? 1 : 2}>
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
    </Box>
  )
}

export default AssessmentComponent

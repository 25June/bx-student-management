import React from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { AssessmentTableComponent } from 'modules/index'
import { Assessment } from 'models/assessment'
import { AssessmentActionType } from 'constant'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useIsMobile } from 'utils/common'
import { fetchAssessments } from 'services'
import { useClassContext } from 'contexts/ClassContext'
import { useDialogContext } from 'contexts/DialogContext'
import { DialogType } from 'constant/common'

const AssessmentComponent = () => {
  const { assessments, setAssessments } = useAssessmentContext()
  const { classId } = useClassContext()
  const { openDialog } = useDialogContext()
  const isMobile = useIsMobile()

  const callback = (refreshData?: boolean): void => {
    if (refreshData) {
      fetchAssessments(classId).then((res) => {
        setAssessments(res)
      })
    }
  }

  const openStudentDialog = (assessment: Assessment | null, type: AssessmentActionType): void => {
    openDialog(DialogType.ASSESSMENT_DIALOG, type, assessment, callback)
  }

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
      </Box>
      <Box p={isMobile ? 1 : 2}>
        {assessments && (
          <AssessmentTableComponent rows={assessments} onClickAction={openStudentDialog} />
        )}
      </Box>
    </Box>
  )
}

export default AssessmentComponent

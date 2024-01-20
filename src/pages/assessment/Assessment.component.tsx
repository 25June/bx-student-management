import React, { useMemo } from 'react'
import { Typography, Box } from '@mui/material'
import { DialogType, AssessmentActionType } from 'constant/common'
import { useIsMobile } from 'utils/common'
import { fetchAssessments } from 'services/assessment'
import { useGetStudentScoreBooks } from 'services/scorebook'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useClassContext } from 'contexts/ClassContext'
import { useDialogContext } from 'contexts/DialogContext'
import { useStudentContext } from 'contexts/StudentContext'
import { StudentScoreBook } from 'models/ScoreBook'
import { Assessment } from 'models/assessment'
import { Student } from 'models/student'
import AssessmentSingleViewComponent from 'modules/assessment-single-view/AssessmentSingleView.component'
import { AssessmentTableComponent } from 'modules/index'

const AssessmentComponent = () => {
  const { assessments, setAssessments } = useAssessmentContext()
  const { classId, disableUpdate, schoolYearId, semesterId } = useClassContext()
  const { openDialog } = useDialogContext()
  const isMobile = useIsMobile()
  const { studentScoreBooks } = useGetStudentScoreBooks()
  const { students } = useStudentContext()

  const stuScoreBooks: StudentScoreBook[] | Student[] = useMemo(() => {
    return (students || []).map((stu) => {
      if (studentScoreBooks?.[stu.id]) {
        return {
          ...stu,
          ...studentScoreBooks[stu.id],
        }
      }
      return stu
    })
  }, [students, studentScoreBooks])

  const callback = (refreshData?: boolean): void => {
    if (refreshData) {
      fetchAssessments(classId, schoolYearId, semesterId).then((res) => {
        setAssessments(res)
      })
    }
  }

  const openStudentDialog = (assessment: Assessment | null, type: AssessmentActionType): void => {
    if (disableUpdate) {
      return
    }
    openDialog(DialogType.ASSESSMENT_DIALOG, type, assessment, callback)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          padding: 1,
          width: '100%',
          alignItems: 'flex-start',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant={'h1'} sx={{ fontSize: '1rem' }}>
          Bài Kiểm Tra
        </Typography>
      </Box>
      <Box p={1}>
        {assessments &&
          (isMobile ? (
            <AssessmentSingleViewComponent
              assessments={assessments}
              onClickAction={openStudentDialog}
              stuScoreBooks={stuScoreBooks}
            />
          ) : (
            <AssessmentTableComponent rows={assessments} onClickAction={openStudentDialog} />
          ))}
      </Box>
    </>
  )
}

export default AssessmentComponent

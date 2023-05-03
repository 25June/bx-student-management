import React, { useState } from 'react'
import { LayoutComponent } from 'modules'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { AssessmentDialogComponent, AssessmentTableComponent } from 'modules/index'
import { Assessment } from 'models/assessment'
import { AssessmentActionType } from 'constant'
import { useAddNewAssessment, useEditAssessment, useDeleteAssessment } from 'services'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { useIsMobile } from 'utils/common'

const AssessmentComponent = () => {
  const mobile = useIsMobile()

  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)

  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<Assessment | null>(null)

  const { showSnackbar } = useSnackbarContext()

  const { assessments } = useAssessmentContext()
  const addNewAssessment = useAddNewAssessment()
  const editAssessment = useEditAssessment()
  const deleteAssessment = useDeleteAssessment()
  console.log({ assessments })

  const closeStudentDialog = (): void => {
    setOpenStudentDialog(false)
    setTimeout(() => {
      setActionType('')
      setActionData(null)
    }, 0)
  }

  const openStudentDialog = (data: Assessment | null, type: AssessmentActionType): void => {
    switch (type) {
      case AssessmentActionType.ADD_NEW_ASSESSMENT:
        setActionType(type)
        break
      case AssessmentActionType.EDIT_ASSESSMENT:
      case AssessmentActionType.DELETE_ASSESSMENT:
        setActionData(data)
        setActionType(type)
        break
    }
    setOpenStudentDialog(true)
  }

  const handleSave = (data: Assessment | Omit<Assessment, 'id'>, action: AssessmentActionType) => {
    switch (action) {
      case AssessmentActionType.ADD_NEW_ASSESSMENT:
        console.log({ data })
        const newValue = data as Omit<Assessment, 'id'>
        addNewAssessment({
          dataInput: newValue,
          onSuccess: () =>
            showSnackbar(
              `Thêm Bài Kiểm Tra ${newValue.type} Thành Công vào ${newValue.bookDate}`,
              'success'
            ),
          onError: () => {
            showSnackbar(
              `Thêm Bài Kiểm Tra ${newValue.type} vào ${newValue.bookDate} Thất Bại`,
              'error'
            )
          },
          onComplete: () => console.log('complete request'),
        })
        break
      case AssessmentActionType.EDIT_ASSESSMENT:
        console.log({ data })
        const value = data as Assessment
        editAssessment({
          dataInput: value,
          onSuccess: () =>
            showSnackbar(
              `Cập Nhật Bài Kiểm Tra ${value.type} Thành Công vào ${value.bookDate}`,
              'success'
            ),
          onError: () => {
            showSnackbar(
              `Cập Nhật Bài Kiểm Tra ${value.type} vào ${value.bookDate} Thất Bại`,
              'error'
            )
          },
          onComplete: () => console.log('complete request'),
        })
        break
      case AssessmentActionType.DELETE_ASSESSMENT:
        console.log({ data })
        const deleteValue = data as Assessment
        deleteAssessment({
          id: deleteValue.id,
          onSuccess: () =>
            showSnackbar(
              `Xoá Bài Kiểm Tra ${deleteValue.type} Thành Công vào ${deleteValue.bookDate}`,
              'success'
            ),
          onError: () => {
            showSnackbar(
              `Xoá Bài Kiểm Tra ${deleteValue.type} vào ${deleteValue.bookDate} Thất Bại`,
              'error'
            )
          },
          onComplete: () => console.log('complete request'),
        })
        break
      default:
        console.log('can not match action type ' + actionType)
        break
    }
  }

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
      {isOpenStudentDialog && (
        <AssessmentDialogComponent
          key={actionData?.id || 'new'}
          isOpen={isOpenStudentDialog}
          onClose={() => closeStudentDialog()}
          action={actionType}
          data={actionData}
          onSave={handleSave}
        />
      )}
    </LayoutComponent>
  )
}

export default AssessmentComponent

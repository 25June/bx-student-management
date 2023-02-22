import React, { useState } from 'react'
import { LayoutComponent } from 'modules'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import useMediaQuery from '@mui/material/useMediaQuery'
import AssessmentDialogComponent from 'modules/assessment-dialog/AssessmentDialog.component'
import { Assessment } from 'models/assessment'
import { AssessmentActionType } from 'constant'

const AssessmentComponent = () => {
  const mobile = useMediaQuery('(max-width:900px)')

  const [isOpenStudentDialog, setOpenStudentDialog] = useState<boolean>(false)

  const [actionType, setActionType] = useState<string>('')
  const [actionData, setActionData] = useState<Assessment | null>(null)

  const closeStudentDialog = (): void => {
    setOpenStudentDialog(false)
    setTimeout(() => {
      setActionType('')
      setActionData(null)
    }, 0)
  }

  const openStudentDialog = (type: string): void => {
    setActionType(type)
    setOpenStudentDialog(true)
  }

  const handleSave = (data: Assessment | Omit<Assessment, 'id'> | string) => {
    switch (actionType) {
      case AssessmentActionType.ADD_NEW_ASSESSMENT:
        console.log({ data })
        // addNewStudent({
        //   dataInput: data,
        //   onSuccess: () =>
        //     showSnackbar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`, 'success'),
        //   onError: () => {
        //     showSnackbar(`Thêm Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`, 'error')
        //   },
        //   onComplete: () => console.log('complete request'),
        // })
        break
      case AssessmentActionType.EDIT_ASSESSMENT:
        console.log({ data })
        // updateStudent({
        //   dataInput: data as Student,
        //   onSuccess: () =>
        //     showSnackbar(
        //       `Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`,
        //       'success'
        //     ),
        //   onError: () => {
        //     showSnackbar(`Cập Nhật Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`, 'error')
        //   },
        //   onComplete: () => console.log('complete request'),
        // })
        break
      case AssessmentActionType.DELETE_ASSESSMENT:
        console.log({ data })
        // deleteStudent({
        //   dataInput: data as Student,
        //   onSuccess: () =>
        //     showSnackbar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thành Công`, 'success'),
        //   onError: () => {
        //     showSnackbar(`Xoá Thiếu Nhi ${data.lastName} ${data.firstName} Thất Bại`, 'error')
        //   },
        //   onComplete: () => console.log('complete request'),
        // })
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
            onClick={() => openStudentDialog(AssessmentActionType.DELETE_ASSESSMENT)}
            sx={{ marginRight: 2 }}
          >
            Thêm Bài Kiểm Tra
          </Button>
        </Box>
      </Box>
      <AssessmentDialogComponent
        isOpen={isOpenStudentDialog}
        onClose={() => closeStudentDialog()}
        action={actionType}
        data={actionData}
        onSave={handleSave}
      />
    </LayoutComponent>
  )
}

export default AssessmentComponent

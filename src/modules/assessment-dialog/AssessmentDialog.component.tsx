import React, { useEffect } from 'react'
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { AssessmentActionType } from 'constant'
import { Controller, useForm } from 'react-hook-form'
import { Assessment } from 'models/assessment'
import { getToday } from 'utils'
import { useAddNewAssessment, useDeleteAssessment, useEditAssessment } from 'services'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { AssessmentEnum } from 'constant/common'
import AssessmentDropdownComponent from 'modules/common/AssessmentDropdown.component'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { getScoreName } from 'utils/getScoreName'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'

type AssessmentForm = {
  bookDate: string
  type: AssessmentEnum
  lesson: string
}

const AssessmentFormDefaultValue = (data: Assessment | null) => {
  if (data) {
    return {
      bookDate: data.bookDate,
      type: data.type,
      lesson: data.lesson,
    }
  }

  return {
    bookDate: getToday(),
    type: AssessmentEnum.KT5,
    lesson: '',
  }
}

interface AssessmentDialogComponentProps {
  data: Assessment | null
  action: string
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
}

const getButtonColor = (type: string): ButtonProps['color'] => {
  if (type === AssessmentActionType.ADD_NEW_ASSESSMENT) {
    return 'primary'
  }
  if (type === AssessmentActionType.EDIT_ASSESSMENT) {
    return 'warning'
  }
  return 'error'
}

const AssessmentDialogComponent = ({
  data,
  action,
  onClose,
  isOpen,
}: AssessmentDialogComponentProps) => {
  const addNewAssessment = useAddNewAssessment()
  const editAssessment = useEditAssessment()
  const deleteAssessment = useDeleteAssessment()
  const { showSnackbar } = useSnackbarContext()

  const { handleSubmit, control, reset, setValue } = useForm<AssessmentForm>({
    defaultValues: AssessmentFormDefaultValue(data),
  })
  useEffect(() => {
    return () => reset()
  }, [reset])

  const onSubmit = async (submitData: AssessmentForm) => {
    if (action === AssessmentActionType.EDIT_ASSESSMENT && data?.id) {
      const updatedAssessment: Assessment = {
        id: data.id,
        classId: data.classId,
        bookDate: submitData.bookDate,
        type: submitData.type,
        lesson: submitData.lesson,
      }
      editAssessment({
        dataInput: updatedAssessment,
        onSuccess: () =>
          showSnackbar(
            `Cập Nhật Bài Kiểm Tra ${updatedAssessment.type} Thành Công vào ${updatedAssessment.bookDate}`,
            'success'
          ),
        onError: () => {
          showSnackbar(
            `Cập Nhật Bài Kiểm Tra ${updatedAssessment.type} vào ${updatedAssessment.bookDate} Thất Bại`,
            'error'
          )
        },
        onComplete: () => onClose(true),
      })
      return
    }
    if (data?.id) {
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
        onComplete: () => onClose(true),
      })
      return
    }
    const newAssessment: Omit<Assessment, 'id'> = {
      classId: '', // TODO Add more field class to the form
      bookDate: submitData.bookDate,
      type: submitData.type,
      lesson: submitData.lesson,
    }
    addNewAssessment({
      dataInput: newAssessment,
      onSuccess: () =>
        showSnackbar(
          `Thêm Bài Kiểm Tra ${newAssessment.type} Thành Công vào ${newAssessment.bookDate}`,
          'success'
        ),
      onError: () => {
        showSnackbar(
          `Thêm Bài Kiểm Tra ${newAssessment.type} vào ${newAssessment.bookDate} Thất Bại`,
          'error'
        )
      },
      onComplete: () => onClose(true),
    })
    return
  }

  const handleChangeAssessmentType = (value: AssessmentEnum) => {
    setValue('type', value)
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose()} aria-labelledby="assessment-dialog-title">
      <DialogTitle id="assessment-dialog-title">
        {action === AssessmentActionType.EDIT_ASSESSMENT && 'Cập nhật thông tin bài kiểm tra'}
        {action === AssessmentActionType.ADD_NEW_ASSESSMENT && 'Thêm thông tin bài kiểm tra'}
        {action === AssessmentActionType.DELETE_ASSESSMENT && 'Xoá thông tin bài kiểm tra'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers={true}>
          {action === AssessmentActionType.DELETE_ASSESSMENT && data?.id ? (
            <DialogContentText>
              {`Bạn có chắc chắn muốn xoá thông tin bài kiểm tra ${getScoreName(
                data.type
              )} vào ngày ${formatYYYMMDDToDDMMYYYY(data.bookDate)}`}
            </DialogContentText>
          ) : (
            <Box>
              <Controller
                control={control}
                name={'lesson'}
                render={({ field }) => (
                  <TextField
                    id="outlined-lesson"
                    label="Bài kiểm tra"
                    type="text"
                    margin="normal"
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name={'type'}
                render={({ field }) => (
                  <Box mt={2} mb={2}>
                    <AssessmentDropdownComponent
                      assessmentType={field.value}
                      onChangeAssessmentType={handleChangeAssessmentType}
                    />
                  </Box>
                )}
              />
              <Controller
                control={control}
                name={'bookDate'}
                render={({ field }) => (
                  <TextField
                    id="outlined-bookDate"
                    label="Ngày làm bài"
                    type="date"
                    helperText="Ngày / Tháng / Năm"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    fullWidth={true}
                    {...field}
                  />
                )}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
          <Button
            color={'neutral'}
            onClick={() => onClose()}
            variant="outlined"
            type={'button'}
            startIcon={<ClearIcon />}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            color={getButtonColor(action)}
            type={'submit'}
            startIcon={<CheckIcon />}
          >
            {action === AssessmentActionType.DELETE_ASSESSMENT ? 'Xoá' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AssessmentDialogComponent

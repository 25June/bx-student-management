import React, { useEffect, useState } from 'react'
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
  CircularProgress,
} from '@mui/material'
import { AssessmentActionType } from 'constant'
import { Controller, useForm } from 'react-hook-form'
import { Assessment } from 'models/assessment'
import { getToday } from 'utils'
import { addNewAssessment, useDeleteAssessment, useEditAssessment } from 'services/assessment'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { AssessmentEnum } from 'constant/common'
import AssessmentDropdownComponent from 'modules/common/AssessmentDropdown.component'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { getScoreName } from 'utils/getScoreName'
import { formatYYYMMDDToDDMMYYYY } from 'utils/datetime'
import { useClassContext } from 'contexts/ClassContext'
import { useAssessmentContext } from 'contexts/AssessmentContext'
import { uploadFile } from 'services/storage'
import { LinearProgressComponent } from 'modules/progress-bar/LinearProgressWithLabel.component'

type AssessmentForm = {
  bookDate: string
  type: AssessmentEnum
  lesson: string
  uploadDocument?: File | null
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
    uploadDocument: null,
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
  const editAssessment = useEditAssessment()
  const deleteAssessment = useDeleteAssessment()
  const { showSnackbar } = useSnackbarContext()
  const { schoolYearId } = useClassContext()
  const { onFetchAssessments } = useAssessmentContext()
  const { classId } = useClassContext()
  const [uploadFileProgress, setUploadFileProgress] = useState<number>(0)

  const { handleSubmit, control, reset, setValue } = useForm<AssessmentForm>({
    defaultValues: AssessmentFormDefaultValue(data),
  })

  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    return () => reset()
  }, [reset])

  const onSubmit = async (submitData: AssessmentForm) => {
    setLoading(true)
    if (action === AssessmentActionType.EDIT_ASSESSMENT && data?.id) {
      const updatedAssessment: Assessment = {
        id: data.id,
        classId: data.classId,
        bookDate: submitData.bookDate,
        type: submitData.type,
        lesson: submitData.lesson,
        schoolYear: data.schoolYear,
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
        onComplete: () => {
          setTimeout(() => {
            setLoading(false)
            onClose(false)
            onFetchAssessments(classId)
          }, 20)
        },
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
        onComplete: () => {
          setTimeout(() => {
            setLoading(false)
            onClose(false)
            onFetchAssessments(classId)
          }, 20)
        },
      })
      return
    }
    const newAssessment: Omit<Assessment, 'id'> = {
      classId,
      bookDate: submitData.bookDate,
      type: submitData.type,
      lesson: submitData.lesson,
      schoolYear: schoolYearId,
    }

    let documentPath = ''
    if (submitData.uploadDocument) {
      documentPath = await uploadFile(submitData.uploadDocument, setUploadFileProgress, false)
    }

    addNewAssessment({
      dataInput: { ...newAssessment, documentPath },
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
      onComplete: () => {
        setLoading(false)
        onClose(false)
        Promise.resolve().then(() => {
          onFetchAssessments(classId)
        })
      },
    })
    return
  }

  const handleChangeAssessmentType = (value: AssessmentEnum) => {
    setValue('type', value)
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose()} aria-labelledby="assessment-dialog-title">
      <DialogTitle id="assessment-dialog-title">
        {action === AssessmentActionType.EDIT_ASSESSMENT && 'Cập nhật bài kiểm tra'}
        {action === AssessmentActionType.ADD_NEW_ASSESSMENT && 'Thêm bài kiểm tra'}
        {action === AssessmentActionType.DELETE_ASSESSMENT && 'Xoá bài kiểm tra'}
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
              <TextField
                id="outlined-bookDate"
                label="Bài kiểm tra"
                type="file"
                helperText="Đính kèm file .doc/.docx/.pdf"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                fullWidth={true}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files?.[0]) {
                    setValue('uploadDocument', event.target.files[0])
                  }
                }}
                inputProps={{ accept: 'application/msword,application/pdf' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
          {isLoading && (
            <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
              <LinearProgressComponent progress={uploadFileProgress} />
            </Box>
          )}
          <Button
            color={'neutral'}
            onClick={() => onClose()}
            variant="outlined"
            type={'button'}
            startIcon={<ClearIcon />}
            disabled={isLoading}
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            color={getButtonColor(action)}
            type={'submit'}
            startIcon={isLoading ? <CircularProgress size={'1rem'} /> : <CheckIcon />}
            disabled={isLoading}
          >
            {action === AssessmentActionType.DELETE_ASSESSMENT ? 'Xoá' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AssessmentDialogComponent

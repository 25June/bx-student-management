import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import SchoolYearsDropdownComponent from 'modules/school-year-dropdown/SchoolYearDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'
import { useIsMobile } from 'utils/common'
import { useClassContext } from 'contexts/ClassContext'

interface ConfigDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
}

interface ConfigForm {
  schoolYearId: string
  semesterId: string
}

const ConfigDialogComponent = ({ onClose, isOpen }: ConfigDialogComponentProps) => {
  const { showSnackbar } = useSnackbarContext()
  const {
    setSchoolYearId,
    setSemesterId,
    semesterId: defaultSemesterId,
    schoolYearId: defaultSchoolYearId,
  } = useClassContext()
  const isMobile = useIsMobile()
  const { handleSubmit, setValue, watch } = useForm<ConfigForm>({
    defaultValues: {
      schoolYearId: defaultSchoolYearId,
      semesterId: defaultSemesterId,
    },
  })
  const schoolYearId = watch('schoolYearId')
  const semesterId = watch('semesterId')

  const [isLoading, setLoading] = useState<boolean>(false)
  const onSubmit = (data: ConfigForm) => {
    setLoading(true)
    Promise.resolve().then(() => {
      setSchoolYearId(data.schoolYearId)
      setSemesterId(data.semesterId)
      setLoading(false)
      setTimeout(() => {
        onClose()
      }, 300)
    })
    showSnackbar('submitting', 'success')
  }

  const handleSelectSchoolYear = (event: SelectChangeEvent) => {
    setValue('schoolYearId', event.target.value)
  }

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setValue('semesterId', event.target.value)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      fullWidth={isMobile}
      aria-labelledby="config-dialog-title"
    >
      <DialogTitle id="diligent-dialog-title">Cài Đặt</DialogTitle>
      <DialogContent dividers={true}>
        <Typography sx={{ marginBottom: '1rem' }}>
          Chọn Niên Khoá và Học Kỳ để lưu điểm các em thiếu nhi
        </Typography>
        <Box mb={3}>
          <SchoolYearsDropdownComponent
            onChangeSchoolYear={handleSelectSchoolYear}
            schoolYearId={schoolYearId}
          />
        </Box>
        <SemesterDropdownComponent
          selectedSemester={semesterId}
          onChangeSemester={handleChangeSemester}
        />
      </DialogContent>
      <DialogActions sx={{ padding: '1rem 1.5rem', position: 'relative' }}>
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          type={'button'}
          startIcon={<ClearIcon />}
          color={'neutral'}
          disabled={isLoading}
        >
          Huỷ
        </Button>
        <Button
          type={'button'}
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={'primary'}
          startIcon={isLoading ? <CircularProgress size={'1rem'} /> : <CheckIcon />}
          disabled={isLoading}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfigDialogComponent

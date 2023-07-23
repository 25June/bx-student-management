import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import SchoolYearsDropdownComponent from 'modules/school-year-dropdown/SchoolYearDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import SemesterDropdownComponent from 'modules/common/SemesterDropdown.component'

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
  const { handleSubmit, setValue, getValues, watch } = useForm<ConfigForm>({
    defaultValues: {},
  })
  const schoolYearId = watch('schoolYearId')

  const [isLoading, setLoading] = useState<boolean>(false)
  const onSubmit = (data: ConfigForm) => {
    console.log({ data })
    setLoading(true)
    showSnackbar('submitting', 'success')
  }

  const handleSelectSchoolYear = (event: SelectChangeEvent) => {
    setValue('schoolYearId', event.target.value)
  }

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setValue('semesterId', event.target.value)
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="config-dialog-title">
      <DialogTitle id="diligent-dialog-title">Cài Đặt</DialogTitle>
      <DialogContent dividers={true}>
        <Box mb={3}>
          <SchoolYearsDropdownComponent
            onChangeSchoolYear={handleSelectSchoolYear}
            schoolYearId={schoolYearId}
          />
        </Box>
        <SemesterDropdownComponent
          selectedSemester={getValues('semesterId')}
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

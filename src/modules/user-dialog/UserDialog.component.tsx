import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useCreateUser } from 'services/user'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import ClassDropdownComponent from 'modules/class-dropdown/ClassDropdown.component'
import { SelectChangeEvent } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'

interface UserDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
}

interface UserFormProps {
  email: string
  firstName: string
  lastName: string
  classId: string
  id: string
}

const UserDialogComponent = ({ onClose, isOpen }: UserDialogComponentProps) => {
  const createUser = useCreateUser()
  const { showSnackbar } = useSnackbarContext()
  const [classObj, setClassObj] = useState<{ id: string; name: string }>(BaseClasses[0])

  const { handleSubmit, control, setValue } = useForm<UserFormProps>({
    defaultValues: { email: '', classId: 'kt1' },
  })

  const onSubmit = ({ email, firstName, lastName, classId, id }: UserFormProps) => {
    createUser({ email, firstName, lastName, classId, id }).finally(() => {
      showSnackbar('Create process completed', 'success')
      onClose(true)
    })
  }

  const handleChangeClass = (event: SelectChangeEvent) => {
    const selectedClass = BaseClasses.find((c: Class) => c.id === (event.target.value as string))
    if (typeof selectedClass === 'undefined') {
      console.error('Error at Selected class')
      return
    }
    setValue('classId', selectedClass.id || BaseClasses[0].id)
    setClassObj(selectedClass)
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose(false)} aria-labelledby="user-dialog-title">
      <DialogTitle id="diligent-dialog-title">Thêm GLV</DialogTitle>
      <DialogContent dividers={true}>
        <Controller
          control={control}
          name={'id'}
          render={({ field }) => (
            <TextField
              id="outlined-id"
              label="id"
              type="text"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'email'}
          render={({ field }) => (
            <TextField
              id="outlined-email"
              label="Email"
              type="text"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name={'lastName'}
          render={({ field }) => (
            <TextField
              id="outlined-last-name"
              label="Họ"
              type="text"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name={'firstName'}
          render={({ field }) => (
            <TextField
              id="outlined-first-name"
              label="Tên"
              type="text"
              margin="normal"
              fullWidth={true}
              {...field}
            />
          )}
        />
        <Box sx={{ marginTop: '1rem' }}>
          <ClassDropdownComponent useDarkMode={false} onChangeClass={handleChangeClass} classObj={classObj} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', position: 'relative' }}>
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          type={'button'}
          startIcon={<ClearIcon />}
          color={'neutral'}
        >
          Huỷ
        </Button>
        <Button
          type={'button'}
          onClick={handleSubmit(onSubmit)}
          autoFocus={true}
          variant="contained"
          color={'primary'}
          startIcon={<CheckIcon />}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDialogComponent

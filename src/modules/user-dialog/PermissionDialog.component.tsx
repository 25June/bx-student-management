import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbarContext } from 'contexts/SnackbarContext'
import { Role, UserRoles } from 'constant/common'
import RoleDropDownComponent from 'modules/common/RoleDropDown.component'
import { User } from 'models/user'
import { useUpdateRole } from 'services/user'

interface PermissionDialogComponentProps {
  onClose: (refreshData?: boolean) => void
  isOpen: boolean
  selectedUser: User
}

const PermissionDialogComponent = ({
  onClose,
  isOpen,
  selectedUser,
}: PermissionDialogComponentProps) => {
  const { showSnackbar } = useSnackbarContext()
  const updateRole = useUpdateRole()
  const { handleSubmit, setValue, getValues } = useForm<{ role: number }>({
    defaultValues: { role: selectedUser.role || Role.CO_CLASS_MANAGER },
  })

  const onSubmit = ({ role }: { role: number }) => {
    console.log(role)
    showSnackbar(`select ${role}`, 'success')
    updateRole(selectedUser, role).finally(() => onClose(true))
  }

  const handleChangeRole = (value: string) => {
    console.log(value)
    setValue('role', parseInt(value, 0))
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      aria-labelledby="user-dialog-title"
      maxWidth={'sm'}
      fullWidth={true}
    >
      <DialogTitle id="change-password-dialog-title">Cấp Quyền</DialogTitle>
      <DialogContent dividers={true}>
        <TextField
          required={true}
          variant="filled"
          id="outlined-password"
          label="Vai Trò Hiện Tại"
          type="text"
          margin="normal"
          fullWidth={true}
          value={selectedUser.role ? UserRoles[selectedUser.role].title : 'Chưa được cấp quyền'}
          disabled={true}
          sx={{ marginBottom: 2 }}
        />
        <RoleDropDownComponent selectedRole={getValues('role')} onChangeRole={handleChangeRole} />
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

export default PermissionDialogComponent

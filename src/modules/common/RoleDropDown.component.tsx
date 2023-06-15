import React, { useState } from 'react'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { UserRoles } from 'constant/common'

interface RoleDropdownComponentProps {
  selectedRole: number
  onChangeRole: (value: string) => void
  size?: SelectProps['size']
}

const RoleDropDownComponent = ({
  selectedRole,
  onChangeRole,
  size = 'small',
}: RoleDropdownComponentProps) => {
  const [userRole, setUserRole] = useState<number>(selectedRole)
  const roleChange = (event: SelectChangeEvent) => {
    onChangeRole(event.target.value)
    setUserRole(Number(event.target.value))
  }

  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel shrink={true}>Vai Trò</InputLabel>
      <Select value={userRole.toString()} label="Vai Trò" onChange={roleChange}>
        {UserRoles.map((role: Record<string, number | string>) => (
          <MenuItem value={role.id} key={role.id}>
            {role.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default RoleDropDownComponent

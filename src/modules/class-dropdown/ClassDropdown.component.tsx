import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import { BaseClasses } from 'constant/common'
import { Class } from 'models'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

interface ClassDropdownProps {
  classObj?: Class
  onChangeClass: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
}

const ClassDropdownComponent = ({
  classObj = BaseClasses[0],
  onChangeClass,
  size = 'medium',
}: ClassDropdownProps) => {
  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel>Lớp</InputLabel>
      <Select value={classObj.id} label="Lớp" onChange={onChangeClass}>
        {BaseClasses.map((c: Class) => (
          <MenuItem value={c.id} key={c.name}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ClassDropdownComponent

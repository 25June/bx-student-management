import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Semesters } from 'constant/common'

interface SemesterDropdownComponentProps {
  selectedSemester: string
  onChangeSemester: (event: SelectChangeEvent) => void
  size?: SelectProps['size']
}

const SemesterDropdownComponent = ({
  selectedSemester,
  onChangeSemester,
  size = 'medium',
}: SemesterDropdownComponentProps) => {
  return (
    <FormControl fullWidth={true} size={size}>
      <InputLabel>Học kỳ</InputLabel>
      <Select
        defaultValue=""
        value={selectedSemester || ''}
        label="Học kỳ"
        onChange={onChangeSemester}
      >
        {Semesters.map(({ key, label }) => (
          <MenuItem value={key} key={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SemesterDropdownComponent
